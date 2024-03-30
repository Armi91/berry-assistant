import { Component, Input, ViewChild } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { ChatService } from 'src/app/_services/chat.service';
import { FileService } from 'src/app/_services/file.service';
import { StorageService } from 'src/app/_services/storage.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styles: [],
})
export class FileUploadComponent {
  @Input({ required: true }) isSending$!: BehaviorSubject<boolean>;
  @ViewChild('fileUpload') fileUpload?: FileUpload;
  file?: File;
  uploadedFiles$?: Observable<{ name: string; id: string }[]>;

  constructor(
    private chatService: ChatService,
    private toastr: ToastrService,
    private fileService: FileService,
    private firestore: Firestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.uploadedFiles$ = this.route.params.pipe(
      switchMap((params) =>
        docData(doc(this.firestore, `chats/${params['chatId']}`))
      ),
      map((chat: any) => chat.attachedFiles)
    );
  }

  async onSelect(event: FileSelectEvent) {
    this.isSending$.next(true);
    this.fileService.uploadFile(event.currentFiles)?.subscribe({
      next: () => {
        this.toastr.success('Plik został przesłany');
        this.chatService.getChat(this.chatService.currentChatId!);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Błąd podczas przesyłania pliku');
      },
      complete: () => {
        this.isSending$.next(false);
        this.fileUpload?.clear();
      },
    });
  }

  async deleteFile(fileId: string) {
    this.isSending$.next(true);
    this.fileService.deleteFile(fileId)?.subscribe({
      next: (data) => {
        this.toastr.success('Usunięto plik');
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Błąd podczas usuwania pliku');
      },
      complete: () => {
        this.isSending$.next(false);
      },
    });
  }
}
