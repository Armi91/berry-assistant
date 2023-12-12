import { onCall } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';
import {
  addNewMessageToDb,
  getMessagesFromDb,
  updateChatNameInDb,
  updateUsageInfo,
} from './fitrestore';

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletion = onCall({ cors: '*' }, async (request) => {
  const data = request.data;
  const previousMessages = await getMessagesFromDb(data.chatId);
  addNewMessageToDb(data.chatId, {content: data.prompt, role: 'user'});

  const chat = await openai.chat.completions.create({
    model: data.model || 'gpt-3.5-turbo',
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
  console.log(models);
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
