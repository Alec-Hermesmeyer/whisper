import fs from 'fs';
import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key.');
}
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const chunks: Uint8Array[] = [];
    const reader = req.body?.getReader();

    if (!reader) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Read incoming file data
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    // Save the file to a temporary location
    const buffer = Buffer.concat(chunks);
    const tempFile = '/tmp/audio.webm';
    const convertedFile = '/tmp/audio.wav';

    fs.writeFileSync(tempFile, buffer);

    // Convert to WAV using ffmpeg
    execSync(`ffmpeg -i ${tempFile} -ar 16000 -ac 1 ${convertedFile}`);

    // Send the converted file to OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(convertedFile),
      model: 'whisper-1',
    });

    // Clean up temporary files
    fs.unlinkSync(tempFile);
    fs.unlinkSync(convertedFile);

    // Respond with the transcription
    return NextResponse.json({ transcription: transcription.text });
  } catch (error) {
    console.error('Error in speech-to-text route:', error);
    return NextResponse.json(
      { error: 'Internal server error. Check logs for details.' },
      { status: 500 }
    );
  }
}
