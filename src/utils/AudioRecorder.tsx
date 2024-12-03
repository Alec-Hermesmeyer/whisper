export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
  
    async startRecording(): Promise<void> {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
  
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
  
      this.mediaRecorder.start();
    }
  
    stopRecording(): Promise<Blob> {
      return new Promise((resolve) => {
        if (this.mediaRecorder) {
          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            resolve(audioBlob);
          };
          this.mediaRecorder.stop();
        }
      });
    }
  }
  
  