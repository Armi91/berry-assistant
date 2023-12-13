require('dotenv').config();
import { credential } from 'firebase-admin';
import { beforeUserCreated } from 'firebase-functions/v2/identity';
const serviceAccount = require('./keys/berry-assistant-f865d-firebase-adminsdk-3l323-ffa734f5af.json');

import { initializeApp } from 'firebase-admin/app';

initializeApp({
  credential: credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

import { chatCompletion, dalle, models, updateChatName } from './openAI';
import { HttpsError } from 'firebase-functions/v2/https';

exports.completion = chatCompletion;
exports.models = models;
exports.updatechatname = updateChatName;
exports.dalle = dalle;

export const beforeCreated = beforeUserCreated((event) => {
  const user = event.data;
  if (!user.email?.includes('@berrylife.pl')) {
    throw new HttpsError('invalid-argument', 'berryEmails');
  }
});

