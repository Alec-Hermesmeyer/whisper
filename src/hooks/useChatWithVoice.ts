import { useState, useCallback, useRef } from 'react';
import { useChat } from 'ai/react';
import { AudioRecorder } from '@/utils/AudioRecorder';

export function useChatWithVoice() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const audioRecorder = useRef(new AudioRecorder());

  /**
   * Handles the completion of transcription by updating the input
   * field and automatically submitting the transcribed text.
   */
  const handleTranscriptionComplete = useCallback(
    async (transcribedText: string) => {
      if (!transcribedText?.trim()) {
        console.warn('Received empty transcription');
        return;
      }
  
      // Set the transcribed text as input
      handleInputChange({ target: { value: transcribedText } } as React.ChangeEvent<HTMLInputElement>);
  
      // Automatically submit the transcribed text as a chatbot query
      await handleSubmit();
    },
    [handleInputChange, handleSubmit]
  );

  // Start recording audio
  const startRecording = useCallback(async () => {
    await audioRecorder.current.startRecording();
    setIsRecording(true);
  }, []);

  // Stop recording and send for transcription
  const stopRecording = useCallback(async () => {
    setIsTranscribing(true);
    try {
      const audioBlob = await audioRecorder.current.stopRecording();
      setIsRecording(false);
  
      // Send audio to Whisper API for transcription
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
  
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log('Transcription API response:', responseData);
  
      // Check if transcription exists
      const transcriptionText = responseData.transcription;
      if (!transcriptionText || !transcriptionText.trim()) {
        throw new Error('Transcription response does not contain valid text.');
      }
  
      // Pass the transcription text to the chatbot
      await handleTranscriptionComplete(transcriptionText);
    } catch (error) {
      console.error('Error during transcription:', error);
      alert('Failed to process audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  }, [handleTranscriptionComplete]);
  

  // Toggle between voice and text input modes
  const toggleInputMode = useCallback(() => {
    setIsVoiceMode((prev) => !prev);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isRecording,
    isVoiceMode,
    startRecording,
    stopRecording,
    toggleInputMode,
    isTranscribing,
  };
}
