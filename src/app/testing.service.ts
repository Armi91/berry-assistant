import { Injectable } from '@angular/core';
import { Functions, httpsCallableFromURL } from '@angular/fire/functions';
import { httpsCallable } from '@firebase/functions';

@Injectable({
  providedIn: 'root',
})
export class TestingService {
  constructor(private functions: Functions) {}

  async testCall() {

    const data = await httpsCallableFromURL(this.functions, 'http://127.0.0.1:5001/berry-assistant-f865d/us-central1/completion')({});
    console.log(data);
  }
}
