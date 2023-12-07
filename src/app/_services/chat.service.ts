import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DocumentReference, Firestore, addDoc, collection, doc, docData, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Chat } from '../_models/chat';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { autoId } from '../_helpers/autoID';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private _currentChat = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this._currentChat.asObservable();

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async newChat() {
    try {
      console.log('new chat');
      const chatId = autoId();
      const chatDocRef = doc(this.firestore, 'chats', chatId)
      const user = await firstValueFrom(this.auth.currentUser$);

      if (user) {
        const chat: Chat = {
          uid: user.uid,
          chatId,
          messages: [{
            role: 'assistant',
            content: 'You are a helpful assistant'
          }],
          name: 'Nowy chat',
          usage: {
            completion_tokens: 0,
            prompt_tokens: 0,
            total_tokens: 0,
          }
        };
        setDoc(chatDocRef, chat).then((chatRef) => {
          this.router.navigate(['/u/chat', chatId]);
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  getChat(chatId: string) {
    const chatRef = doc(this.firestore, 'chats', chatId) as DocumentReference<Chat>;
    docData(chatRef).subscribe({
      next: (chat) => {
        if (chat) {
          this._currentChat.next(chat);
        }
      }
    })
  }

  sendPrompt(p: string, chatId: string) {
    const prompt = this._parsePropmpt(p);
    this.api.callFunction('completion', {prompt, chatId}).catch((error) => {
      console.log(error);
      this.toastr.error('Wystąpił błąd');
    })

  }

  private _parsePropmpt(prompt: string) {
    // TODO: parse prompt
    return prompt;
  }
}
