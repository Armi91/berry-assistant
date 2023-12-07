require('dotenv').config();

import { initializeApp } from 'firebase-admin/app';
import { chatCompletion } from './openAI';

initializeApp({
  projectId: process.env.PROJECT_ID,
})

exports.completion = chatCompletion;
