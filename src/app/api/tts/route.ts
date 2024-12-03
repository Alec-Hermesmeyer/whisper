import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    console.log('Request Body:', requestBody);

    const { text } = requestBody;
    console.log('Extracted Text:', text);

    if (!text) {
      return NextResponse.json({ error: 'Text is required for TTS' }, { status: 400 });
    }

    const ttsResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);
    return NextResponse.json(  'Failed to process TTS request' , { status: 500 });
  }
}
