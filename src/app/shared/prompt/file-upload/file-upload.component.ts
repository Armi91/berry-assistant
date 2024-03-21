import { Component, Input } from '@angular/core';
import { getDownloadURL } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { FileSelectEvent, FileUploadEvent } from 'primeng/fileupload';
import { BehaviorSubject, take } from 'rxjs';
import { ChatService } from 'src/app/_services/chat.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styles: [],
})
export class FileUploadComponent {
  @Input({ required: true }) isSending$!: BehaviorSubject<boolean>;
  file?: File;

  constructor(
    private storageService: StorageService,
    private chatService: ChatService,
    private toastr: ToastrService
  ) {}

  async onSelect(event: FileSelectEvent) {
    this.file = event.currentFiles[0];
    this.isSending$.next(true);
    const url = await this.upload();
    if (url) {
      this.chatService.currentChat$.pipe(take(1)).subscribe({
        next: (chat) => {
          throw new Error('Function not implemented.');
          // this.chatService.sendPrompt('', chat?.chatId!, chat?.model!, url).then(() => {
          //   this.isSending$.next(false);
          // }).catch((err) => {
          //   console.error(err);
          //   this.toastr.error('Błąd podczas wysyłania pliku');
          //   this.isSending$.next(false);
          // })
        },
      });
    } else {
      this.isSending$.next(false);
      this.toastr.error('Błąd podczas wysyłania pliku');
    }
  }

  async upload() {
    if (!this.file) return null;
    try {
      const task = await this.storageService.upload(
        this.file,
        `temp/${this.file.name}`
      );
      const url = await getDownloadURL(task.ref);
      return url;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
