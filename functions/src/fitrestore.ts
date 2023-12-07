import { firestore } from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function addNewMessageToDb(chatId: string, message: any) {
  return await firestore()
    .collection('chats')
    .doc(chatId)
    .update({
      messages: FieldValue.arrayUnion(message),
    });
}

export async function getMessagesFromDb(chatId: string) {
  const chatRef = firestore().collection('chats').doc(chatId);
  const chat = await chatRef.get();
  const chatData = chat.data();
  if (chatData) {
    return chatData.messages;
  }
}

export async function updateUsageInfo(chatId: string, usage: any) {
  return await firestore()
    .collection('chats')
    .doc(chatId)
    .update({
      usage: {
        completion_tokens: FieldValue.increment(usage.completion_tokens),
        prompt_tokens: FieldValue.increment(usage.prompt_tokens),
        total_tokens: FieldValue.increment(usage.total_tokens),
      },
    });
}
