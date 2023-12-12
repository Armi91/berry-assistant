import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  DocumentReference,
  Firestore,
  Timestamp,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
  of,
  switchMap,
} from 'rxjs';
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

  async newChat(model: string) {
    try {
      const chatId = autoId();
      const chatDocRef = doc(this.firestore, 'chats', chatId);
      const user = await firstValueFrom(this.auth.currentUser$);

      if (user) {
        const chat: Chat = {
          uid: user.uid,
          chatId,
          model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant',
            },
          ],
          name: 'Nowy chat',
          usage: {
            completion_tokens: 0,
            prompt_tokens: 0,
            total_tokens: 0,
          },
          createdAt: Timestamp.now(),
        };
        setDoc(chatDocRef, chat).then((chatRef) => {
          this.router.navigate(['/u/chat', chatId]);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteChat(chatId: string) {
    try {
      const chatRef = doc(this.firestore, 'chats', chatId);
      await deleteDoc(chatRef)
      this.toastr.success('Usunięto czat');
      this.router.navigate(['/u/chat']);
    } catch (error) {
      console.log(error);
      this.toastr.error('Wystąpił błąd');
    }
  }

  getChat(chatId: string) {
    const chatRef = doc(
      this.firestore,
      'chats',
      chatId
    ) as DocumentReference<Chat>;
    docData(chatRef).subscribe({
      next: (chat) => {
        if (chat) {
          this._currentChat.next(chat);
        }
      },
    });
  }

  sendPrompt(p: string, chatId: string, model: string) {
    const prompt = this._parsePropmpt(p);
    return this.api
      .callFunction('completion', { prompt, chatId, model })
      .catch((error) => {
        console.log(error);
        this.toastr.error('Wystąpił błąd');
      });
  }

  getChatsList() {
    const colRef = collection(this.firestore, 'chats');

    return this.auth.currentUser$.pipe(
      switchMap((user) => {
        if (user) {
          return collectionData(query(colRef, where('uid', '==', user.uid)));
        } else {
          return of([]);
        }
      })
    );
  }

  getModelsList() {
    // this.api.callFunction('models').then((models) => {
    //   // console.log(models);
    // }).catch(error => {
    //   console.log(error);
    // })
  }

  updateChatName(chatId: string, prompt: string) {
    this.api
      .callFunction('updatechatname', { chatId, prompt })
      .catch((error) => {
        console.log(error);
      });
  }

  private _parsePropmpt(prompt: string) {
    // TODO: parse prompt
    return prompt;
  }
}
