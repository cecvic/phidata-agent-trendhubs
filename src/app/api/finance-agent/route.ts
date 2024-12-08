import OpenAI from 'openai';
import { NextResponse } from 'next/server';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('Received request for financial analysis');
  
  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const { symbol, analysisType } = body;

    if (!symbol) {
      console.error('Missing symbol in request');
      return NextResponse.json(
        { error: 'Stock symbol is required' },
        { status: 400 }
      );
    }

    let prompt = '';
    switch (analysisType) {
      case 'recommendations':
        prompt = `Analyze and summarize the latest analyst recommendations for ${symbol}`;
        break;
      case 'price':
        prompt = `Provide a brief price analysis for ${symbol} including key metrics`;
        break;
      case 'info':
        prompt = `Share key company information and fundamentals for ${symbol}`;
        break;
      case 'news':
        prompt = `Summarize the latest important news for ${symbol}`;
        break;
      default:
        console.error('Invalid analysis type:', analysisType);
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    console.log('Sending request to OpenAI with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst assistant that provides clear insights about stocks and financial data. Format your response using markdown for better readability."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('Received response from OpenAI');

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response content from OpenAI');
    }

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('Finance agent error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze financial data' },
      { status: 500 }
    );
  }
} 