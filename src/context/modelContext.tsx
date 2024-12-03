"use client";
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

interface ModelContextType {
  isLoading: boolean;
  error: string | null;
  whisperPipeline: any;
  toxicityModel: any;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);



export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whisperPipeline, setWhisperPipeline] = useState<any>(null);
  const [toxicityModel, setToxicityModel] = useState<any>(null);
  const [detectedCommand, setDetectedCommand] = useState('');
  const recognizerRef = useRef<any>(null);
  const speechCommands = require('@tensorflow-models/speech-commands');

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Ensure TensorFlow.js is ready
        await tf.ready();

        // Create a recognizer
        const recognizer = speechCommands.create('BROWSER_FFT');
        await recognizer.ensureModelLoaded();

        recognizerRef.current = recognizer;
        setIsModelLoaded(true);
        console.log('Speech command model loaded');
      } catch (error) {
        console.error('Error loading speech command model:', error);
      }
    };

    loadModel();
  }, []);


  return (
    <ModelContext.Provider value={{ isLoading, error, whisperPipeline, toxicityModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
};
function setIsModelLoaded(arg0: boolean) {
    throw new Error('Function not implemented.');
}

