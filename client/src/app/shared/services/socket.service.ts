import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {map, Observable, Subject, takeUntil, tap} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
// @ts-ignore
import * as io from 'socket.io-client';
import {
  chatGetAvailableRooms,
  roomGetMessagesAction, roomGetNewMessageAction,
  roomMessageReadAction,
  roomMessageRemoveAction,
  roomSwitchAction,
  roomUpdateMessageAction
} from "../../store/room-chat/room-chat.actions";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {SnackBarNotificationService} from "./snack-bar-notification.service";
import {IUser} from "../models/IUser";
import {IRoom} from "../models/IRoom";
import {ChatService} from "./chat.service";

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

  public termination$: Subject<number> = new Subject<number>();

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private chatService: ChatService,
              private snackBar: SnackBarNotificationService,
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

  public listenNewMessage(): Observable<any> {
    return this.listen('newMessage').pipe(
      map((value) => {
        this.store.dispatch(roomGetNewMessageAction({message: value.message, roomId: value.room}))
      }),
      takeUntil(this.termination$));
  }

  public listenInvitation(): Observable<any> {
    return this.listen('invitation-dialog').pipe(takeUntil(this.termination$),);
  }

  public listenUserJoined(): Observable<any> {
    return this.listen('userJoined').pipe(
      map((value: {user: IUser, room: IRoom})=>{
        console.log('(socket service) value from listenUserJoined', value);

        if (!value.room) {
          this.snackBar.openSnackBar("welcome " + value.user.name, "");
          return;
        }
        else {
          this.snackBar.openSnackBar(value.user.name + " has joined " + value.room.title, "");
          if (value.user._id === this.chatService.me)
            this.router.navigate(["chat", value.room._id]);
          else return;
        }
      }),
      takeUntil(this.termination$),
    );
  }

  public listenUserLeft(): Observable<any> {
    return this.listen('userLeft').pipe(
      tap((value: {user: IUser, room: IRoom}) => {
        console.log("(socket service) user left / has been kicked value ", value);
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());

        if (value.user._id === this.chatService.me) {
          this.store.dispatch(roomSwitchAction({roomId: "common"}));
          this.router.navigate(["chat", "common"]);
        }
        // else this.router.navigate(["chat", value.room._id]);

        this.snackBar.openSnackBar(value.user.name + " left the room " + value.room.title, "Ok");
      }),
      takeUntil(this.termination$),
    );
  }

  public listenNewRoom(): Observable<any> {
    return this.listen('newRoom').pipe(
      map(() => {
        this.emit('getAllRooms', {});
        this.snackBar.openSnackBar("Room has been created", "Ok");
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenRoomDeleted(): Observable<any> {
    return this.listen('roomDeleted').pipe(
      map((data: any) => {
        this.snackBar.openSnackBar("room has been deleted", "Ok")

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
      map(() => {
        this.snackBar.openSnackBar("room has been renamed", "")
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenPrivacyChanged(): Observable<any> {
    return this.listen('privacyChanged').pipe(
      map(() => {
        this.snackBar.openSnackBar("room privacy changed", "Ok")
        this.emit('getAllRooms', {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenSearchRoomsResult(): Observable<any> {
    return this.listen('searchRoomsResult').pipe(takeUntil(this.termination$));
  }

  public listenGetAllRooms(): Observable<any> {
    return this.listen('allRooms').pipe(takeUntil(this.termination$));
  }

  public listenMessageRead(): Observable<any> {
    return this.listen('messageRead').pipe(
      map((value) => {
        this.store.dispatch(roomMessageReadAction({messageId: value.id, userId: value.user}));
      }),
      takeUntil(this.termination$)
    );
  }

  public listenMessageUpdated(): Observable<any> {
    return this.listen('messageUpdated').pipe(
      map((value) => {
        this.store.dispatch(roomUpdateMessageAction({messageId: value.id, correction: value.newContent}));
      }),
      takeUntil(this.termination$));
  }

  public listenMessageDeleted(): Observable<any> {
    return this.listen('messageDeleted').pipe(
      map((value) => {
        this.store.dispatch(roomMessageRemoveAction({messageId: value.id}));
      }),
      takeUntil(this.termination$));
  }

  public destroy(): void {
    this.termination$.next(1);
    this.termination$.complete();
  }
}
