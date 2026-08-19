import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

const SYSTEM_PROMPT = `You are TravelRight's trip assistant. Before searching for places,
make sure you know: the location, and roughly what kind of experience the
user wants (food, culture, outdoors, nightlife, etc). If either is missing
or ambiguous, ask ONE concise clarifying question instead of calling a tool.
Once you have enough, call search_places.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const conversation: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages,
  ];

  const response = await client.chat.completions.create({
    model: 'meta-llama/Llama-3.3-70B-Instruct',
    messages: conversation,
  });

  console.log(response.choices[0]);

  return new NextResponse(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
