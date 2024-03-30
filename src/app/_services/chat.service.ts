import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, catchError, of, switchMap } from 'rxjs';
import { Chat, Message } from '../_models/chat';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
    const currentChat = this._currentChat.getValue();
    currentChat?.messages.push({
      role: 'user',
      content: prompt,
    });
    this._currentChat.next(currentChat);
    this.api
      .post(`chat/${currentChat?.threadId ? 'thread/' : ''}${chatId}/prompt`, {
        prompt,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          this.toastr.error(error.message, 'Wystąpił błąd');
          return of(null);
        })
      )
      .subscribe();

    return this.createEventSource(chatId, !!currentChat?.threadId);
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
  }

  createDalleImage(prompt: string) {
    return this.api.callFunction('dalle', { prompt });
  }

  createEventSource(chatId: string, isThread: boolean) {
    if (this.eventSource?.OPEN) {
      this.eventSource.close();
    }
    this.eventSource = new EventSource(
      `${environment.apiUrl}chat/${isThread ? 'thread/' : ''}${chatId}/stream`
    );
    return new Observable((observer) => {
      this.eventSource!.addEventListener(chatId, (event) => {
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
    // TODO: Parse prompt for some commands
    return prompt;
  }
}
