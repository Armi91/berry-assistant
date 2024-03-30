import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  authState,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  docData,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<User | null> = of(null);
  authState$ = authState(this.auth);
  err: any;
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.currentUser$ = this.getCurrentUser();
  }

  getCurrentUser(): Observable<User | null> {
    return authState(this.auth).pipe(
      switchMap((userCreds) => {
        if (userCreds) {
          return <Observable<User>>(
            docData(doc(this.firestore, `users/${userCreds.uid}`))
          );
        } else {
          return of(null);
        }
      })
    );
  }

  loginWithEmail(loginForm: { email: string; password: string }) {
    signInWithEmailAndPassword(
      this.auth,
      loginForm.email,
      loginForm.password
    ).then((user) => {});
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCreds = await signInWithPopup(this.auth, provider);
      const userDocRef = doc(this.firestore, `users/${userCreds.user?.uid}`);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        const user: User = {
          uid: userCreds.user?.uid,
          email: userCreds.user?.email || '',
          displayName: userCreds.user?.displayName || '',
          photoURL: userCreds.user?.photoURL || '',
        };
        await setDoc(userDocRef, user);
      }
      this.router.navigate(['/u/chat']);
    } catch (error: any) {
      this.err = error;
      // console.log(error);
      if (error.message.includes('berryEmails')) {
        this.toastr.error('Zaloguj się za pomocą konta Berrylife', 'Błąd', {
          disableTimeOut: true,
        });
      } else {
        this.toastr.error(error.message);
      }
    }
  }

  register(registerDto: any) {
    throw new Error('Method not implemented.');
  }

  signOut() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  setCurrentUser(uid: string) {
    docData(doc(this.firestore, `users/${uid}`));
  }

  async getIdToken() {
    return await this.auth.currentUser?.getIdToken();
  }
}
