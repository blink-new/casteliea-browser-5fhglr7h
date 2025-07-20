import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: 'casteliea-browser-5fhglr7h',
  authRequired: false // Browser doesn't require auth for basic functionality
});