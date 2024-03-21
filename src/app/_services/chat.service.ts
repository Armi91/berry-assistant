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
  catchError,
  firstValueFrom,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Chat, Message } from '../_models/chat';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { autoId } from '../_helpers/autoID';
import { Model } from '../_models/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _currentChat = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this._currentChat.asObservable();

  private _chatsList = new BehaviorSubject<Array<Chat>>([]);
  chatsList$ = this._chatsList.asObservable();

  messageStream$?: Observable<any>;

  eventSource?: EventSource;

  constructor(
    private api: ApiService,
    private firestore: Firestore,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  get currentChatId() {
    return this._currentChat.getValue()?.chatId;
  }

  newChat(model: string) {
    this.api.post<{ chatId: string }>('chat/create', { model }).subscribe({
      next: ({ chatId }) => {
        this.router.navigate(['/u/chat', chatId]);
        // this.getChatsList();
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message, 'Wystąpił błąd');
      },
    });
  }

  async newCustomChat(chat: Chat) {
    this.api
      .post<{ chatId: string }>('chat/create-custom', {
        model: chat.model,
        top_p: chat.top_p,
        temperature: chat.temperature,
        context: chat.messages[0].content,
      })
      .subscribe({
        next: ({ chatId }) => {
          this.router.navigate(['/u/chat', chatId]);
        },
        error: (error) => {
          console.error(error);
          this.toastr.error(error.message, 'Wystąpił błąd');
        },
      });
  }

  async deleteChat(chatId: string) {
    this.api.delete('chat', chatId).subscribe({
      next: () => {
        this.toastr.success('Usunięto czat');
        this.router.navigate(['/u/chat']);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message, 'Wystąpił błąd');
      },
    });
  }

  getChat(chatId: string) {
    this.api.get<Chat>(`chat/${chatId}`).subscribe({
      next: (chat) => {
        this._currentChat.next(chat);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error(error.message, 'Wystąpił błąd');
      },
    });
  }

  sendPrompt(prompt: string, chatId: string, model?: string, url?: string) {
    // const body: any = {
    //   prompt,
    //   chatId,
    //   model,
    // };
    // if (url) {
    //   body['pdf_link'] = url;
    // }

    const currentChat = this._currentChat.getValue();
    currentChat?.messages.push({
      role: 'user',
      content: prompt,
    });
    this._currentChat.next(currentChat);

    this.api
      .post(`chat/${chatId}/prompt`, { prompt })
      .pipe(
        catchError((error) => {
          console.error(error);
          this.toastr.error(error.message, 'Wystąpił błąd');
          return of(null);
        })
      )
      .subscribe();

    return this.createEventSource(chatId);
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
    // return this.api.get<Model[]>('models');
    this.api
      .callFunction('models')
      .then((models) => {})
      .catch((error) => {
        console.error(error);
        this.toastr.error(error.message, 'Nie udało się pobrać listy modeli');
      });
  }

  updateChatName(chatId: string, prompt: string, answer: string) {
    const messages = [
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'assistant',
        content: answer,
      },
    ];
    this.api.put(`chat/${chatId}`, { messages }).subscribe();
    // this.api
    //   .callFunction('updatechatname', { chatId, prompt })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }

  createDalleImage(prompt: string) {
    return this.api.callFunction('dalle', { prompt });
  }

  createEventSource(chatId: string) {
    if (this.eventSource?.OPEN) {
      this.eventSource.close();
    }
    this.eventSource = new EventSource(
      `${environment.apiUrl}chat/${chatId}/stream`
    );
    return new Observable((observer) => {
      this.eventSource!.addEventListener('chat.completion.chunk', (event) => {
        const messageData = JSON.parse(event.data);
        observer.next(messageData);
        if (messageData.finish_reason === 'stop') {
          this.eventSource?.close();
          observer.complete();
        }
      });
    });
  }

  updateMessagesList(message: Message) {
    const currentChat = this._currentChat.getValue();
    currentChat?.messages.push(message);
    this._currentChat.next(currentChat);
  }

  private _parsePropmpt(prompt: string) {
    // TODO: parse prompt
    return prompt;
  }
}
