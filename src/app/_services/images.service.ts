import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from './storage.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageReference, getDownloadURL } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  save(imageLink: string) {
    this.api
      .callFunction('saveimage', { imageLink })
      .then((response) => {});
  }
  isUploading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private firestore: Firestore,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  sendDallePrompt(prompt: string) {
    return this.api.callFunction('dalle', { prompt }).catch((err) => {
      console.error(err);
      this.toastr.error(err.message, 'Wystąpił błąd');
    });
  }

  async saveImageToDatabase(
    name: string,
    prompt: string,
    revisedPrompt: string,
    ref: StorageReference
  ) {
    try {
      const user = await firstValueFrom(this.auth.currentUser$);
      const uid = user?.uid;
      if (uid) {
        const docRef = doc(this.firestore, `images/users/${uid}/${name}`);
        const url = await getDownloadURL(ref);
        await setDoc(docRef, {
          name,
          prompt,
          revisedPrompt,
          uid,
          url,
        }).then((x) => {})
        this.toastr.success('Zapisano obraz', 'Sukces');
        this.isUploading$.next(false);
        return new Promise((resolve) => resolve(true));
      } else {
        this.toastr.error('Nie udało się zapisać obrazka', 'Wystąpił błąd');
        this.isUploading$.next(false);
        return new Promise((resolve) => resolve(false));
      }
    } catch (err: any) {
      console.error(err);
      err?.message && this.toastr.error(err.message, 'Wystąpił błąd');
      this.isUploading$.next(false);
      return new Promise((resolve, reject) => reject(err));
    }
  }

  saveImageToStorage(
    image: Blob,
    name: string,
    prompt: string,
    revisedPrompt: string
  ) {
    this.isUploading$.next(true);
    let ref: StorageReference;
    this.storageService.upload(image, `images/${name}`).on(
      'state_changed',
      (snapshot) => {
        ref = snapshot.ref;
      },
      (err) => {
        err.message && this.toastr.error(err.message, 'Wystąpił błąd');
        this.isUploading$.next(false);
      },
      async () => {
        const imageSaved = await this.saveImageToDatabase(name, prompt, revisedPrompt, ref);
        if (imageSaved) {
          this.isUploading$.next(false);
          this.toastr.success('Zapisano obraz', 'OK', {timeOut: 5000});
          console.log({imageSaved});

        }
      }
    );
  }

  getFileFromUrl(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        console.log(blob);
      }
    })
  }
}
