import { tool } from 'ai';
import { z } from 'zod';

export const searchPlacesTool = tool({
  description: 'Search places tool test',
  inputSchema: z.object({
    location: z.string().describe('The location to search for places'),
    category: z
      .string()
      .describe(
        'The category of places to search for (e.g. restaurant, museum, hike, bar)',
      ),
    radius_miles: z
      .number()
      .default(5)
      .describe('The radius in miles to search within'),
  }),
  // this will eventually call the actual tool that should call the google api and do things accordingly.
  execute: async ({ location, category, radius_miles }) => {
    return {
      results: `Searching for ${category} in ${location} within ${radius_miles} miles`,
    };
  },
});

/*
const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => {
    // Your implementation
    return { temperature: 72, conditions: 'sunny' };
  },
});
 */
