import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private api: ApiService, private chatService: ChatService) {}

  uploadFile(files: File[]) {
    const chatId = this.chatService.currentChatId;
    if (!chatId) return;
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    return this.api.post(`chat/file-upload/${chatId}`, formData);
  }

  deleteFile(fileId: string) {
    const chatId = this.chatService.currentChatId;
    if (!chatId) return;
    return this.api.delete(`chat/file`, `${chatId}/${fileId}`);
  }
}
