import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { map, Observable, startWith, Subject, takeUntil, tap } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
// @ts-ignore
import * as io from "socket.io-client";
import {
  roomGetNewMessageAction,
  roomMessageReadAction,
  roomMessageRemoveAction,
  roomUpdateMessageAction
} from "../../store/room/room.actions";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { SnackBarNotificationService } from "./snack-bar-notification.service";
import { IUser } from "../models/IUser";
import { IRoom } from "../models/IRoom";
import { ChatService } from "./chat.service";
import { IMessage } from "../models/IMessage";
import { RoomService } from "./room.service";
import {
  chatGetAvailableRooms,
  chatGetNewRoomAction,
  chatSearchRoomsActions,
  chatRemoveParticipantAction,
  chatRemoveRoomAction,
  chatAddParticipantAction,
  chatRoomRenamedAction,
  chatRoomPrivacyChangedAction
} from "../../store/chat/chat.actions";
import { SignalRService } from "./signal-r.service";

@Injectable({
  providedIn: "root"
})
export class SocketService {
  public socket: any;
  public readonly uri: string = environment.API_URL;
  public isConnected: boolean = false;

  public termination$: Subject<number> = new Subject<number>();

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private chatService: ChatService,
              private roomService: RoomService,
              private snackBar: SnackBarNotificationService,
              private store: Store,
              private signalRService: SignalRService) {
  }

  public connect(): void {
    if (!this.isConnected) {
      // @ts-ignore
      this.socket = io(this.uri, { query: `token=${this.localStorageService.getToken()}` });
      this.isConnected = true;
    } else {
      console.error("---UNAUTHORIZED. SOCKET IS NOT CONNECTED");
    }

    this.signalRService.startMessagesConnection();
    this.signalRService.startUsersConnection();
    this.signalRService.startRoomsConnection();

    // this.signalRService.listenMessageEvent("newMessage", (value: { message: IMessage, room: string, creator: string } | null) => {
    this.signalRService.listenMessageEvent("newMessage", (value: string) => {
      if (value) {
        const message: IMessage = JSON.parse(value);
        console.log("new message", message);
        this.chatService.lastMessageCreatorId = message.creator?._id ?? "";
        if (message.room === "common") {
          const messagesInCommon = this.roomService.messagesInCommon.value;
          this.roomService.messagesInCommon.next([...messagesInCommon, message]);
        }
        this.store.dispatch(roomGetNewMessageAction({ message: message, roomId: message.room }));
        this.snackBar.openSnackBar("You receive new Message", [], {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 50,
        });
        return message;
      }
      return null;
    });
    this.signalRService.listenMessageEvent("messageUpdated", (value: string) => {
      if (value) {
        const message: IMessage = JSON.parse(value);
        console.log(message);
        this.store.dispatch(roomUpdateMessageAction({ messageId: message._id, correction: message.content }));
        this.snackBar.openSnackBar("Message has been updated", ["Ok"], {
          horizontalPosition: "center",
          verticalPosition: "bottom",
          duration: 500,
        });
      }
    });
    this.signalRService.listenMessageEvent("messageRead", (value: any) => {
      console.log("Before JSON parsing" + value);
      value = JSON.parse(value) as { messageId: string, userId: string } | null;
      console.log("After JSON parsing" + value);
      if (value) {
        this.store.dispatch(roomMessageReadAction({ messageId: value.id, userId: value.user }));
      }
    });
    this.signalRService.listenRoomEvent("newRoom", (value: any) => {
      const room = JSON.parse(value) as IRoom;
      this.store.dispatch(chatGetNewRoomAction({ room }));
      this.snackBar.openSnackBar("Room has been created", ["Ok"], {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 2000,
      });
    });
    this.signalRService.listenRoomEvent("privacyChanged", (value: any) => {
      const room = JSON.parse(value) as IRoom;
      if (room !== null) {
        const [id, isPublic] = [room._id, room.isPublic];
        this.store.dispatch(chatRoomPrivacyChangedAction({ id, isPublic }));
      }
    });
    this.signalRService.listenRoomEvent("roomRename", (value: any) => {
      const room = JSON.parse(value) as IRoom;
      console.log("room renamed", room);
      if (room !== null) {
        const [roomId, title] = [room._id, room.title];
        this.store.dispatch(chatRoomRenamedAction({ roomId, title }));
      }
    });
    this.signalRService.listenRoomEvent("userLeft", (value: any) => {
      const room = JSON.parse(value) as IRoom;
      if (room !== null) {
        if (room.users.length <= 2) {
          this.store.dispatch(chatRemoveRoomAction({ room }));
        } else {
          this.store.dispatch(chatRemoveParticipantAction({ room: room }));
        }

        if (!room.users.some((user) => user._id === this.chatService.me)) {
          this.router.navigate(["chat", "common"]);
        }

        this.snackBar.openSnackBar(value.user.name + " left the room " + room.title, [], {
          horizontalPosition: "center",
          verticalPosition: "top",
          duration: 1000,
        });
      }
    });
  }

  public listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    }).pipe(startWith(null));
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
  * @params isInChatComponent - a parameter that needed for track weather this listener is in the chat Component
  */
  // public listenNewMessage(): Observable<any> {
  //   return this.listen("newMessage").pipe(
  //     map((value: { message: IMessage, room: string, creator: string } | null) => {
  //       if(value) {
  //         this.chatService.lastMessageCreatorId = value.message.creator?._id ?? "";
  //         if (value.room === "common") {
  //           const messagesInCommon = this.roomService.messagesInCommon.value;
  //           this.roomService.messagesInCommon.next([...messagesInCommon, value.message]);
  //         }
  //         this.store.dispatch(roomGetNewMessageAction({ message: value.message, roomId: value.room }));
  //         this.snackBar.openSnackBar("You receive new Message", [], {
  //           horizontalPosition: "center",
  //           verticalPosition: "top",
  //           duration: 50,
  //         });
  //         return value;
  //       }
  //       return null;
  //     }),
  //     takeUntil(this.termination$));
  // }

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
      map((value: { user: IUser, room: IRoom } | null) => {
        if (value !== null) {
          // this.emit("getAllRooms", {});
          this.store.dispatch(chatAddParticipantAction({ room: value.room }));

          if (!value.room && value.user._id === this.chatService.me) {
            this.snackBar.openSnackBar("welcome " + value.user.name, ["ok"], {
              horizontalPosition: "center",
              verticalPosition: "top",
              duration: 300,
            });
            return;
          } else {
            if (value.user._id === this.chatService.me)
              this.router.navigate(["chat", value.room._id]);
            else return;
          }
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
      tap((value: { user: IUser, room: IRoom } | null) => {
        if (value) {
          const room = value.room;
          if (value.room.users.length <= 2) {
            this.store.dispatch(chatRemoveRoomAction({ room }));
          } else {
            this.store.dispatch(chatRemoveParticipantAction({ room: room }));
          }

          if (value.user._id === this.chatService.me) {
            this.router.navigate(["chat", "common"]);
          }

          this.snackBar.openSnackBar(value.user.name + " left the room " + room.title, [], {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 1000,
          });
        }
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
  // public listenNewRoom(): Observable<any> {
  //   return this.listen("newRoom").pipe(
  //     map((room: IRoom) => {
  //       this.store.dispatch(chatGetNewRoomAction({room}));
  //       this.snackBar.openSnackBar("Room has been created", ["Ok"], {
  //         horizontalPosition: "center",
  //         verticalPosition: "top",
  //         duration: 2000,
  //       });
  //     }),
  //     takeUntil(this.termination$),
  //   );
  // }

  /*
  * @description socket event listener that listen Room deleted event from the backend
  * @description usually this event generates when room left with only 1 user, or if it were deleted manually
  *
  * @description the following logic describes: If room were deleted then we update the list
  *                                           : effect will navigate user to "common" if one was in the deleted room
  */
  public listenRoomDeleted(): Observable<any> {
    return this.listen("roomDeleted").pipe(
      map((value: { room: IRoom } | null) => {
        if (value) {
          const room = value.room;
          this.store.dispatch(chatRemoveRoomAction({ room }));

          this.snackBar.openSnackBar(value.room.title + " has been deleted", [], {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 500,
          });
        }
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
      tap((value: { id: string, title: string } | null) => {
        if (value) {
          const [roomId, title] = [value.id, value.title];
          this.store.dispatch(chatRoomRenamedAction({ roomId, title }));

          this.snackBar.openSnackBar("room has been renamed", [], {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 500,
          });
        }
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
      tap((value: { id: string, isPublic: boolean } | null) => {
        if (value !== null) {
          const [id, isPublic] = [value.id, value.isPublic];
          this.store.dispatch(chatRoomPrivacyChangedAction({ id, isPublic }));
        }
      }),
      takeUntil(this.termination$),
    );
  }

  public listenSearchRoomsResult(): Observable<any> {
    return this.listen("searchRoomsResult").pipe(
      tap((rooms: IRoom[]) => {
        this.store.dispatch(chatSearchRoomsActions({ rooms }));
      }),
      takeUntil(this.termination$)
    );
  }

  /*
  * @description socket event listener that used in the effect for update the rooms
  * @description usually this event generates when "get all rooms" event was emitted
  *
  * @description the logic of this listener described in the effect
  */
  public listenGetAllRooms(): Observable<any> {
    return this.listen("allRooms").pipe(
      tap((rooms: IRoom[] | null) => {
        if (rooms) {
          this.store.dispatch(chatGetAvailableRooms({ rooms }));
        }
      }),
      takeUntil(this.termination$));
  }

  /*
  * @description socket event listener that listen message read
  * @description usually this event generates when message occur in the user's viewport
  *
  * @description the logic of this listener described in the effect and reducer
  */
  // public listenMessageRead(): Observable<any> {
  //   return this.listen("messageRead").pipe(
  //     tap((value: any | null) => {
  //       if(value) {
  //         this.store.dispatch(roomMessageReadAction({ messageId: value.id, userId: value.user }));
  //       }
  //     }),
  //     takeUntil(this.termination$)
  //   );
  // }

  /*
  * @description socket event listener that listen message updated
  * @description usually this event generates when user update one
  *
  * @description the logic of this listener described in the effect and reducer
  */
  // public listenMessageUpdated(): Observable<any> {
  //   return this.listen("messageUpdated").pipe(
  //     map((value: any | null) => {
  //       if(value) {
  //         this.store.dispatch(roomUpdateMessageAction({ messageId: value.id, correction: value.newContent }));
  //         this.snackBar.openSnackBar("Message has been updated", ["Ok"], {
  //           horizontalPosition: "center",
  //           verticalPosition: "bottom",
  //           duration: 500,
  //         });
  //       }
  //     }),
  //     takeUntil(this.termination$));
  // }

  /*
  * @description socket event listener that listen message deleted
  * @description usually this event generates when user delete one
  *
  * @description the logic of this listener described in the effect and reducer
  */
  public listenMessageDeleted(): Observable<any> {
    return this.listen("messageDeleted").pipe(
      tap((value: any | null) => {
        if (value) {
          this.snackBar.openSnackBar("Message has been deleted", ["Ok", "Discard"], {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 500,
          });
          this.store.dispatch(roomMessageRemoveAction({ messageId: value.id }));
        }
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
