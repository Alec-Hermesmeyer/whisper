import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Unsupported content type. Expected application/json.' },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid input. Messages must be an array.' },
        { status: 400 }
      );
    }

    const { messages } = body;

    // Fetch chat response from OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a legal assistant chatbot.' },
        ...messages,
      ],
    });

    const botMessage = chatResponse.choices[0]?.message?.content;

    if (!botMessage) {
      throw new Error('Failed to generate a response from the chatbot.');
    }

    // Respond with the textual content
    return NextResponse.json({ text: botMessage });
  } catch (error: any) {
    console.error('Error in /api/chat:', error.response || error.message || error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
