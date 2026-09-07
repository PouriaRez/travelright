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

// const SYSTEM_PROMPT = `You are TravelRight's trip assistant.
// Below is a list of things you MUST cover and stay strict on:
//   1. Always ensure that you have the information needed to provide the absolute best service to your customers.
//   2. Make sure to route any locations found with the best routes to take.
//     ** For example, if a customer is staying in paris, you want to return their itinerary based on spots that are back to back to one another.
//       These locations are to be within small distances of each other and you never have to go backwards to get to the next location or site **
//   3. Confirm all details are correct or if they want to change anything before searching for places.
//   4. If any information is missing or ambiguous, ask concise cl

// Before searching for places, questions you MUST ask to gather all the information include:

//  1. The location they are traveling to.
//  2. How long they are planning on staying at this location for.
//  3. What type of experience or experiences they want to have.
//     ** Make sure that you see if they want to group experiences together or have a variety throughout their day **
//  4. Ask them if they have a hotel, if so, ask for that hotel, if not ask if they want high rated and commonly visited locations.

// your response must follow this format:

//  `;

const SYSTEM_PROMPT = `You are TravelRight's trip assistant. Your job is to help users find things to do by calling the search_places tool.

REQUIRED before calling search_places:
1. Location (city or neighborhood)
2. What kind of experience they want (food, culture, outdoors, nightlife, etc.)

If either is missing, ask exactly ONE concise clarifying question — never ask about
both at once. Prioritize location first if both are missing.

OPTIONAL — don't ask about these upfront, only follow up if the user brings them up:
- Trip length / how long they're staying
- Whether they have a hotel or home base
- Whether they want experiences grouped together or spread across the day

Once you have location and experience type, call search_places immediately.
Do not ask more than one clarifying question per turn.

After you get results back, summarize them briefly and mention rating and
distance for each place and it's address. Do not attempt to plan routes or itineraries — that
happens outside this conversation.`;

/*
 , and roughly what kind of experience the
user wants (food, culture, outdoors, nightlife, etc). If either is missing
or ambiguous, ask ONE concise clarifying question instead of calling a tool.
Once you have enough, call search_places.
 */

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

    console.log('--- DEBUG ---');
    console.log('Tool calls:', JSON.stringify(result.toolCalls, null, 2));
    console.log('Tool results:', JSON.stringify(result.toolResults, null, 2));
    console.log('Steps:', result.steps.length);
    console.log('Finish reason:', result.finishReason);
    console.log('-------------');

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
