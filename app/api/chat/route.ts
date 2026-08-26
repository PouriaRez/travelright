import { NextRequest, NextResponse } from 'next/server';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { headers } from 'next/headers';
import { ratelimit } from '../../../lib/rate-limit';
import { generateText, isStepCount } from 'ai';
import { searchPlacesTool } from '../../../lib/ai/tools/search-place';

const hf = createOpenAICompatible({
  name: 'huggingface',
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
});

const SYSTEM_PROMPT = `You are TravelRight's trip assistant. Before searching for places,
make sure you know: the location, and roughly what kind of experience the
user wants (food, culture, outdoors, nightlife, etc). If either is missing
or ambiguous, ask ONE concise clarifying question instead of calling a tool.
Once you have enough, call search_places.`;

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = (await headers()).get('x-forwarded-for') ?? 'anonymous';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    console.warn(`Rate limit hit for ${ip}`);

    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      },
    );
  }

  const { messages } = await req.json();
  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  try {
    const result = await generateText({
      model: hf('meta-llama/Llama-3.3-70B-Instruct'),
      system: SYSTEM_PROMPT,
      messages,
      tools: { search_places: searchPlacesTool },
      stopWhen: isStepCount(2),
    });

    return NextResponse.json(
      { content: result.text },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      },
    );
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
