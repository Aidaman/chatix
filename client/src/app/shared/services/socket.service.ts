import {Injectable, OnDestroy} from '@angular/core';
import {environment} from "../../../environments/environment";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import * as io from 'socket.io-client';
import {chatGetAvailableRooms, roomGetMessagesAction, roomSwitchAction} from "../../store/room-chat/room-chat.actions";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SocketService{
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

  public termination$: Subject<number> = new Subject<number>();

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private store: Store) {
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

  public listenLeaveRoom(): Observable<any>{
    return this.listen('leaveRoom').pipe(
      map((data) => {
        console.log('this is data from socketService "leaveRoom" listener', data);
        this.store.dispatch(roomGetMessagesAction({roomId: data.room, offset:50}))
        return true
      }),
      takeUntil(this.termination$),
    );
  }

  public listenNewMessage(): Observable<any>{
    return this.listen('newMessage').pipe(
      map((data) => {
        console.log('this is data from socketService "newMessage" listener', data);
        this.store.dispatch(roomGetMessagesAction({roomId: data.room, offset:50}))
        return true
      }),
      takeUntil(this.termination$),
    );
  }

  public listenInvitation(): Observable<any>{
    return this.listen('invitation');
  }

  public listenUserJoined(): Observable<any>{
    return this.listen('userJoined').pipe(takeUntil(this.termination$),);
  }

  public listenNewRoom(): Observable<any> {
    return this.listen('newRoom').pipe(
      map((data: any) => {
        console.log('these data is from socketService "new room" listener', data)
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenUserLeft(): Observable<any> {
    return this.listen('userLeft').pipe(
      map((value)=> {
        console.log("user left value", value);
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());
        this.store.dispatch(roomSwitchAction({roomId: "common"}));
      }),
      takeUntil(this.termination$),
      );
  }

  public listenRoomDeleted(): Observable<any> {
    return this.listen('roomDeleted').pipe(
      map((data: any) => {
        console.log("(Room Deleted) this is the incoming data: ", data)

        this.emit('getAllRooms', {});

        this.store.dispatch(chatGetAvailableRooms());
        this.store.dispatch(roomSwitchAction({roomId: 'common'}));
        this.router.navigate(['chat', 'common']);

      }),
      takeUntil(this.termination$),
    );
  }

  public listenRoomRenamed(): Observable<any> {
    return this.listen('roomRename').pipe(
      map((data: any) => {
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenPrivacyChanged(): Observable<any> {
    return this.listen('privacyChanged').pipe(
      map((data: any) => {
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenSearchRoomsResult(): Observable<any> {
    return this.listen('searchRoomsResult');
  }

  public listenGetAllRooms(): Observable<any> {
    return this.listen('allRooms');
  }

  public destroy(): void {
    this.termination$.next(1);
    this.termination$.complete();
  }
}
