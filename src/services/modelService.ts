import * as tf from '@tensorflow/tfjs';
import { pipeline } from '@xenova/transformers';

let whisperPipeline: any = null;
let toxicityModel: any = null;

export const loadModels = async () => {
  try {
    // Load TensorFlow.js and toxicity model
    await tf.ready();
    const toxicity = await import('@tensorflow-models/toxicity');
    toxicityModel = await toxicity.load(0.5, ['toxicity']);
    console.log('Toxicity model loaded');

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
export const getToxicityModel = () => toxicityModel;
