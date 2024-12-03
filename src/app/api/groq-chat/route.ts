import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize GROQ with API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      messages,
      model: 'llama3-8b-8192', // Replace with your model
    });

    return NextResponse.json(response.choices[0]?.message || {});
  } catch (error) {
    console.error('Error with GROQ API:', error);
    return NextResponse.json({ error: 'Failed to process chat completion' }, { status: 500 });
  }
}
