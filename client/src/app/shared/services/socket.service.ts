import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
// @ts-ignore
import * as io from "socket.io-client";
import {
  roomGetNewMessageAction,
  roomMessageRemoveAction,
  roomUpdateMessageAction, roomUserConnectedAction
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
  chatGetNewRoomAction,
  chatRemoveParticipantAction,
  chatRemoveRoomAction,
  chatAddParticipantAction,
  chatRoomRenamedAction,
  chatRoomPrivacyChangedAction, chatGetNewMessageAction, chatMessageReadAction
} from "../../store/chat/chat.actions";
import { SignalRService } from "./signal-r.service";

@Injectable({
  providedIn: "root"
})
export class SocketService {
  public termination$: Subject<number> = new Subject<number>();

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private chatService: ChatService,
              private roomService: RoomService,
              private snackBar: SnackBarNotificationService,
              private store: Store,
              private signalRService: SignalRService) {
  }

  private startUsersConnection(){
    this.signalRService.startUsersConnection();

    this.signalRService.listenUserEvent("userJoined", (value: any) => {
      const answer: {room: IRoom, user: IUser} | null = JSON.parse(value) as { user: IUser, room: IRoom } | null;
      if (answer !== null) {
        this.store.dispatch(chatAddParticipantAction({ room: answer.room }));

        if (!answer.room && answer.user._id === this.chatService.getMe()) {
          return;
        } else {
          if (answer.user._id === this.chatService.getMe())
            this.router.navigate(["chat", answer.room._id]);
          else return;
        }
      }
    });
    this.signalRService.listenUserEvent("connected", (value: any) => {
      const user = JSON.parse(value) as IUser;
      if(user){
        this.store.dispatch(roomUserConnectedAction({ userId: user._id }));
      }
    });
    this.signalRService.listenUserEvent("disconnected", (value: any) => {
      const user = JSON.parse(value) as IUser;
      if(user){
        this.store.dispatch(roomUserConnectedAction({ userId: user._id }));
      }
    });
  }

  private startRoomsConnection(){
    this.signalRService.startRoomsConnection();

    this.signalRService.listenRoomEvent("newMessage", (message: IMessage) => {
      this.newMessageHandler(message);
    });
    this.signalRService.listenRoomEvent("newRoom", (room: IRoom) => {
      if(room){
        this.store.dispatch(chatGetNewRoomAction({ room }));
      }
    });
    this.signalRService.listenRoomEvent("privacyChanged", (room: IRoom) => {
      if (room !== null) {
        const [id, isPublic] = [room._id, room.isPublic];
        this.store.dispatch(chatRoomPrivacyChangedAction({ id, isPublic }));
      }
    });
    this.signalRService.listenRoomEvent("roomRename", (room: IRoom) => {
      console.log("room renamed", room);
      if (room !== null) {
        const [roomId, title] = [room._id, room.title];
        this.store.dispatch(chatRoomRenamedAction({ roomId, title }));
      }
    });
    this.signalRService.listenRoomEvent("userLeft", (room: IRoom) => {
      if (room !== null) {
        if (!room.users.some((user) => user._id === this.chatService.getMe())) {
          this.store.dispatch(chatRemoveRoomAction({ room }));
          this.router.navigate(["chat", "common"]);
        }

        if (room.users.length < 2) {
          this.store.dispatch(chatRemoveRoomAction({ room }));
        } else {
          this.store.dispatch(chatRemoveParticipantAction({ room: room }));
        }
      }
    });
    this.signalRService.listenRoomEvent("userJoin", (room: IRoom) => {
      if (room !== null) {
        this.store.dispatch(chatAddParticipantAction({ room }));
      }
    });
    this.signalRService.listenRoomEvent("roomDeleted", (room: IRoom) => {
      console.log("room deleted: ", room);
      if (room) {
        this.store.dispatch(chatRemoveRoomAction({ room }));
        this.router.navigate(["chat", "common"]);
      }
    });
  }

  private startMessagesConnection(){
    this.signalRService.startMessagesConnection();

    this.signalRService.listenMessageEvent("newMessage", (message: IMessage) => {
      this.newMessageHandler(message);
    });
    this.signalRService.listenMessageEvent("messageUpdated", (message: IMessage) => {
      if (message) {
        this.store.dispatch(roomUpdateMessageAction({ messageId: message._id, updatedMessage: message }));
      }
    });
    this.signalRService.listenMessageEvent("messageDeleted", (message: IMessage) => {
      console.log(message);
      if (message) {
        this.store.dispatch(roomMessageRemoveAction({ messageId: message._id }));
      }
    });
    this.signalRService.listenMessageEvent("messageRead", (message: IMessage) => {
      const roomId = message.room;
      console.log(roomId);
      if(roomId){
        this.store.dispatch(chatMessageReadAction({ roomId }));
      }
    });
  }

  public connect(): void {
    this.startMessagesConnection();
    this.startRoomsConnection();
    this.startUsersConnection();

    this.signalRService.invokeUserEvent("Connect", JSON.stringify(this.chatService.getMe()));
  }

  private newMessageHandler(message?: IMessage) {
    if (message) {
      this.chatService.lastMessageCreatorId = message.creator?._id ?? "";
      if (message.room === "common") {
        const messagesInCommon = this.roomService.messagesInCommon.value;
        this.roomService.messagesInCommon.next([...messagesInCommon, message]);
      }
      this.store.dispatch(roomGetNewMessageAction({ message: message, roomId: message.room }));
      this.store.dispatch(chatGetNewMessageAction({ message: message, me: this.chatService.getMe(), roomId: message.room }));
      return message;
    }
    return null;
  }

  public disconnect(): void {
    // this.socket.disconnect();
  }

  /*
  * @description method that terminates all the listeners to complete triggering "takeUntil" operator
  */
  public destroy(): void {
    this.termination$.next(1);
    this.termination$.complete();

    this.signalRService.invokeUserEvent("Disconnect", JSON.stringify(this.chatService.getMe()));
  }
}
