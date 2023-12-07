require('dotenv').config();
import { OpenAI } from 'openai';
import { onCall } from 'firebase-functions/v2/https';
// import { initializeApp } from 'firebase-admin/app';

// initializeApp();

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

// console.log(process.env.OPENAI_API_KEY);


exports.completion = onCall(async (data) => {
  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Show me some js code',
      },
    ],
    stream: true,
  })

  for await (const chunk of chat) {
    console.log(chunk.choices[0].delta.content);
  }
  return {ok: true};
});
