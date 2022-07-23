import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // public webSocketSubject!: WebSocketSubject<any>;
  // public messages$: Subject<any> = new Subject<any>();
  // public readonly uri: string = environment.API_URL_WSS;
  // public isConnected: boolean = false;
  //
  // constructor() {
  // }
  //
  // public connect(): void {
  //   this.webSocketSubject = webSocket(this.uri);
  //   console.log(this.webSocketSubject)
  //   // if (!this.isConnected) {
  //   //
  //   //
  //   //   // const messages = this.webSocketSubject.pipe(
  //   //   //   tap({
  //   //   //     error: error => console.log(error),
  //   //   //   }), catchError(_ => EMPTY));
  //   //   // this.messages$.next(messages);
  //   //
  //   //   this.isConnected = true;
  //   // } else {
  //   //   console.error('---UNAUTHORIZED. SOCKET IS NOT CONNECTED');
  //   // }
  // }
  //
  // public emit(msg: any) {
  //   this.webSocketSubject.next(msg);
  // }
  //
  // // public emit(eventName: string, data: any): void {
  // //
  // // }
  //
  // public disconnect() {
  //   this.webSocketSubject.complete();
  // }
  //
  // // public listen(eventName: string): Observable<any> {
  // //   return new Observable((subscriber) => {
  // //     this.socket.on(eventName, (data) => {
  // //       subscriber.next(data);
  // //     });
  // //   });
  // // }
  // //
  // //

  public socket: any;
  public readonly uri: string = environment.API_URL;
  public isConnected: boolean = false;

  constructor(private localStorageService: LocalStorageService,) {
  }

  public connect(): void {
    if (!this.isConnected) {
      // @ts-ignore
      this.socket = io(this.uri, {query: `token=${this.localStorageService.getToken()}`});
      this.isConnected = true;
    } else {
      console.error('---UNAUTHORIZED. SOCKET IS NOT CONNECTED');
    }
  }

  public listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  public emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public listenJoin(): Observable<any>{
    return this.listen('join');
  }

  public listenNewMessage(): Observable<any>{
    return this.listen('newMessage');
  }

  public listenInvitation(): Observable<any>{
    return this.listen('invitation');
  }

  public listenNewRoom(): Observable<any> {
    // return this.listen('createRoom');
    return this.listen('newRoom');
  }

  public listenUserLeft(): Observable<any> {
    return this.listen('userLeft');
  }

  public listenRoomDeleted(): Observable<any> {
    return this.listen('roomDeleted');
  }

  public listenRoomRenamed(): Observable<any> {
    return this.listen('roomRename');
  }

  public listenPrivacyChanged(): Observable<any> {
    return this.listen('privacyChanged');
  }

  public listenSearchRoomsResult(): Observable<any> {
    return this.listen('searchRoomsResult');
  }

  public listenGetAllRooms(): Observable<any> {
    return this.listen('allRooms');
  }
}
