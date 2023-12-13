import { onCall } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';
import {
  addNewMessageToDb,
  getChatFromDb,
  updateChatNameInDb,
  updateUsageInfo,
} from './fitrestore';

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletion = onCall({ cors: '*' }, async (request) => {
  const data = request.data;
  const existingChat = await getChatFromDb(data.chatId);
  const previousMessages = existingChat?.messages || [];
  addNewMessageToDb(data.chatId, {content: data.prompt, role: 'user'});

  const chat = await openai.chat.completions.create({
    model: existingChat?.model || 'gpt-3.5-turbo',
    temperature: existingChat?.temperature || 1,
    top_p: existingChat?.top_p || 1,
    messages: [
      ...previousMessages,
      {
        role: 'user',
        content: data.prompt,
      },
    ],
  })

  // for await (const chunk of chat) {
  //   console.log(chunk.choices[0].delta.content);
  // }
  await addNewMessageToDb(data.chatId, chat.choices[0].message);
  await updateUsageInfo(data.chatId, chat.usage);
  // return {chat};
  return { ...previousMessages };
});

export const models = onCall({ cors: '*' }, async (request) => {
  const models = await openai.models.list();
  return { models };
});

export const updateChatName = onCall({ cors: '*' }, async (request) => {
  const data = request.data;
  const chat = await openai.chat.completions.create({
    model: data.model || 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant who can create a short chat name from a given prompt.',
      },
      {
        role: 'user',
        content: `Utwórz nazwę dla czatu z podanego poniżej tekstu. Nazwa powinna mieć maksymalnie 20 znaków. Tekst: ${data.prompt}`,
      },
    ],
  })
  await updateChatNameInDb(data.chatId, chat.choices[0].message.content || 'Nowy chat');
  return { success: true };
});

export const dalle = onCall({ cors: '*' }, async (request) => {
  const data = request.data;
  const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: data.prompt,
    response_format: 'b64_json'
  })
  return { image };
});
