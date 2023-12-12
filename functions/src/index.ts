require('dotenv').config();
import { credential } from 'firebase-admin';
const sacc = require('./keys/berry-assistant-f865d-firebase-adminsdk-3l323-ffa734f5af.json');

import { initializeApp } from 'firebase-admin/app';

initializeApp({
  credential: credential.cert(sacc),
  projectId: sacc.project_id,
})

import { chatCompletion, models, updateChatName } from './openAI';

// import { HttpsError, beforeUserCreated } from 'firebase-functions/v2/identity';




exports.completion = chatCompletion;
exports.models = models;
exports.updatechatname = updateChatName;

// export const beforeCreated = beforeUserCreated(event => {
//   const user = event.data;
//   if (!user.email?.includes('@berrylife.pl')) {
//     throw new HttpsError('invalid-argument', 'Only berrylife.pl emails are allowed');
//   }
// })
