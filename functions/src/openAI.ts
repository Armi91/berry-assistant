import { onCall } from "firebase-functions/v2/https";
import { OpenAI } from 'openai';
import { addNewMessageToDb, getMessagesFromDb, updateUsageInfo } from "./fitrestore";

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletion = onCall(async (request) => {
  const data = request.data;
  const previousMessages = await getMessagesFromDb(data.chatId);
  addNewMessageToDb(data.chatId, {content: data.prompt, role: 'user'});

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
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
  return {chat};
});

