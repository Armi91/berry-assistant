import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private functions: Functions) { }

  callFunction(fnName: string, data: any = {}) {
    const call = httpsCallable(this.functions, fnName);
    return call(data);
  }
}
