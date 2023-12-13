import { Injectable } from '@angular/core';
import { Storage, UploadTask, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  upload(file: File | Blob, path: string): UploadTask {
    const storageRef = ref(this.storage, path);
    return uploadBytesResumable(storageRef, file);
  }
}
