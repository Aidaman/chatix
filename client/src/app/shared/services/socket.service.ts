import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { map, Observable, Subject, takeUntil, tap } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
// @ts-ignore
import * as io from "socket.io-client";
import {
  chatGetAvailableRooms,
  roomGetMessagesAction, roomGetNewMessageAction,
  roomMessageReadAction,
  roomMessageRemoveAction,
  roomSwitchAction,
  roomUpdateMessageAction
} from "../../store/room-chat/room-chat.actions";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { SnackBarNotificationService } from "./snack-bar-notification.service";
import { IUser } from "../models/IUser";
import { IRoom } from "../models/IRoom";
import { ChatService } from "./chat.service";
import { IMessage } from "../models/IMessage";

@Injectable({
  providedIn: "root"
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
      this.socket = io(this.uri, { query: `token=${this.localStorageService.getToken()}` });
      this.isConnected = true;
    } else {
      console.error("---UNAUTHORIZED. SOCKET IS NOT CONNECTED");
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

  /*
  * @description socket event listener that listen new messages
  * @description usually this event occurs when backend update room messages
  *
  * @description the logic described in the reducer and effect
  */
  public listenNewMessage(): Observable<any> {
    return this.listen("newMessage").pipe(
      map((value: { message: IMessage, room: string }) => {
        this.snackBar.openSnackBar("You receive new Message", "");
        this.store.dispatch(roomGetNewMessageAction({ message: value.message, roomId: value.room }));
      }),
      takeUntil(this.termination$));
  }

  /*
  * @description socket event listener that listen Room renamed event from the backend
  * @description usually this event generates when user receive invitation to the room
  *
  * @description the logic described in the chat component
  */
  public listenInvitation(): Observable<any> {
    return this.listen("invitation-dialog").pipe(takeUntil(this.termination$),);
  }

  /*
  * @description socket event listener that listen User joined event from the backend
  * @description usually this event generates when user connects or accepting invitation to the chat
  *
  * @description the following logic describes: user joined somewhere, so then we need to update rooms ("getAllRooms")
  *                                           : then it checks is this event occurs from the connection or invitation
  *                                           : (if user connected then room is absent)
  *                                           : in every other situation it redirects user to the room it was invited
  */
  public listenUserJoined(): Observable<any> {
    return this.listen("userJoined").pipe(
      map((value: {user: IUser, room: IRoom}) => {
        this.emit("getAllRooms", {});
        this.store.dispatch(chatGetAvailableRooms());

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

  /*
  * @description socket event listener that listen User left event from the backend
  * @description usually this event generates when user leave the room, or if it were kicked from one
  *
  * @description the following logic describes: user joined somewhere, so then we need to update rooms ("getAllRooms")
  *                                           : then it checks is the user is current user.
  *                                           : If it is then user redirects to the common
  */
  public listenUserLeft(): Observable<any> {
    return this.listen("userLeft").pipe(
      tap((value: {user: IUser, room: IRoom}) => {
        this.emit("getAllRooms", {});
        this.store.dispatch(chatGetAvailableRooms());

        if (value.user._id === this.chatService.me) {
          this.store.dispatch(roomSwitchAction({ roomId: "common" }));
          this.router.navigate(["chat", "common"]);
        }
        // else this.router.navigate(["chat", value.room._id]);

        this.snackBar.openSnackBar(value.user.name + " left the room " + value.room.title, "Ok");
      }),
      takeUntil(this.termination$),
    );
  }

  /*
  * @description socket event listener that listen Room creation event from the backend
  * @description usually this event generates when user creates a room, or if it were invited to one
  *
  * @description the following logic describes: if rooms really appear - we update the list ("getAllRooms")
  */
  public listenNewRoom(): Observable<any> {
    return this.listen("newRoom").pipe(
      map(() => {
        this.emit("getAllRooms", {});
        this.snackBar.openSnackBar("Room has been created", "Ok");
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  /*
  * @description socket event listener that listen Room deleted event from the backend
  * @description usually this event generates when room left with only 1 user, or if it were deleted manually
  *
  * @description the following logic describes: If room were deleted then we update the list
  *                                           : effect will navigate user to "common" if one was in the deleted room
  */
  public listenRoomDeleted(): Observable<any> {
    return this.listen("roomDeleted").pipe(
      map((data: { room: IRoom }) => {
        this.snackBar.openSnackBar(data.room.title + " has been deleted", "");

        this.emit("getAllRooms", {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  /*
  * @description socket event listener that listen Room renamed event from the backend
  * @description usually this event generates when room was updated
  *
  * @description the following logic describes: If room were renamed - just update the list
  */
  public listenRoomRenamed(): Observable<any> {
    return this.listen("roomRename").pipe(
      map(() => {
        this.snackBar.openSnackBar("room has been renamed", "");
        this.emit("getAllRooms", {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  /*
  * @description socket event listener that listen Room privacy changed event from the backend
  * @description usually this event generates when room was updated
  *
  * @description the following logic describes: If room privacy were changed - just update the list
  */
  public listenPrivacyChanged(): Observable<any> {
    return this.listen("privacyChanged").pipe(
      map(() => {
        this.snackBar.openSnackBar("room privacy changed", "Ok");
        this.emit("getAllRooms", {});
        this.store.dispatch(chatGetAvailableRooms());
      }),
      takeUntil(this.termination$),
    );
  }

  public listenSearchRoomsResult(): Observable<any> {
    return this.listen("searchRoomsResult").pipe(takeUntil(this.termination$));
  }

  /*
  * @description socket event listener that used in the effect for update the rooms
  * @description usually this event generates when "get all rooms" event was emited
  *
  * @description the logic of this listener described in the effect
  */
  public listenGetAllRooms(): Observable<any> {
    return this.listen("allRooms").pipe(takeUntil(this.termination$));
  }

  /*
  * @description socket event listener that listen message read
  * @description usually this event generates when message occur in the user's viewport
  *
  * @description the logic of this listener described in the effect and reducer
  */
  public listenMessageRead(): Observable<any> {
    return this.listen("messageRead").pipe(
      map((value) => {
        this.store.dispatch(roomMessageReadAction({ messageId: value.id, userId: value.user }));
      }),
      takeUntil(this.termination$)
    );
  }

  /*
  * @description socket event listener that listen message updated
  * @description usually this event generates when user update one
  *
  * @description the logic of this listener described in the effect and reducer
  */
  public listenMessageUpdated(): Observable<any> {
    return this.listen("messageUpdated").pipe(
      map((value) => {
        this.snackBar.openSnackBar("Message has been updated","Ok");
        this.store.dispatch(roomUpdateMessageAction({ messageId: value.id, correction: value.newContent }));
      }),
      takeUntil(this.termination$));
  }

  /*
  * @description socket event listener that listen message deleted
  * @description usually this event generates when user delete one
  *
  * @description the logic of this listener described in the effect and reducer
  */
  public listenMessageDeleted(): Observable<any> {
    return this.listen("messageDeleted").pipe(
      map((value) => {
        this.snackBar.openSnackBar("Message has been deleted","Ok");
        this.store.dispatch(roomMessageRemoveAction({ messageId: value.id }));
      }),
      takeUntil(this.termination$));
  }

  /*
  * @description method that terminates all the listeners to complete triggering "takeUntil" operator
  */
  public destroy(): void {
    this.termination$.next(1);
    this.termination$.complete();
  }
}
