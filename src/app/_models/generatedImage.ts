import { Timestamp } from "@angular/fire/firestore";

export interface GeneratedImage {
  createdAt: Timestamp;
  name: string;
  prompt: string;
  revisedPrompt: string;
  uid: string;
  url: string;
}
