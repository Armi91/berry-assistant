import { firestore } from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function addNewMessageToDb(chatId: string, message: any) {
  try {
    return await firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        messages: FieldValue.arrayUnion(message),
      });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function getMessagesFromDb(chatId: string) {
  try {
    const chatRef = firestore().doc(`chats/${chatId}`);
    const chatDoc = await chatRef.get();
    const chatData = chatDoc.data();
    console.log(chatData);

    if (chatData) {
      return chatData.messages;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateUsageInfo(chatId: string, usage: any) {
  try {
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
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export async function updateChatNameInDb(chatId: string, name: string) {
  try {
    return await firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        name,
      });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
