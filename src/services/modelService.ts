
import { pipeline } from '@xenova/transformers';

let whisperPipeline: any = null;


export const loadModels = async () => {
  try {

    // Load Whisper model
    whisperPipeline = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny.en'
    );
    console.log('Whisper model loaded');
  } catch (error) {
    console.error('Error loading models:', error);
    throw error;
  }
};

export const getWhisperPipeline = () => whisperPipeline;

