import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  authState,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import { DocumentData, Firestore, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map, of, switchMap, take } from 'rxjs';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$: Observable<User | null> = of(null);
  authState$ = authState(this.auth);

  constructor(private auth: Auth, private firestore: Firestore, private toastr: ToastrService) {
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
      if (userSnap.exists()) {
        return;
      } else {
        const user: User = {
          uid: userCreds.user?.uid,
          email: userCreds.user?.email || '',
          displayName: userCreds.user?.displayName || '',
        };
        setDoc(userDocRef, user);
      }

    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message);
    }
  }

  register(registerDto: any) {
    throw new Error('Method not implemented.');
  }

  setCurrentUser(uid: string) {
    docData(doc(this.firestore, `users/${uid}`));
  }
}
