import { Injectable } from "@angular/core";
import { RoomSelectDialogComponent } from "../../dialog/room-select-dialog/room-select-dialog.component";
import { roomMessageRemoveAction } from "../../store/room/room.actions";
import { SocketService } from "./socket.service";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ChatService } from "./chat.service";
import { IRoom } from "../models/IRoom";
import { RoomService } from "./room.service";
import { BehaviorSubject } from "rxjs";
import {IMessage} from "../models/IMessage";
import {SignalRService} from "./signal-r.service";

@Injectable({
  providedIn: "root"
})
export class MessagesService {
  public messageSent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isEditing: boolean = false;

  constructor(private socketService: SocketService,
              private chatService: ChatService,
              private roomService: RoomService,
              private store: Store,
              private dialog: MatDialog,
              private signalR: SignalRService) { }

  private deleteMessage(messageId: string, roomId: string) {
    this.socketService.emit("deleteMessage", { messageId, roomId });
    this.store.dispatch(roomMessageRemoveAction({ messageId }));
  }

  public sendMessage(room: IRoom, messageText: string, messageId: string){
    const newMessage = { messageId: messageId, newContent: messageText, roomId: room._id, userId: this.chatService.me };
    const newMessageString: string = JSON.stringify(newMessage).slice(1, JSON.stringify(newMessage).length-1);

    if (messageText) {
      if (room._id === "common" && this.isEditing) {
        this.roomService.editMessageInCommon(messageId, messageText);
      }

      else if (room._id.toLowerCase() !== "common" && this.isEditing)
        this.signalR.invokeMessageEvent("UpdateMessage", JSON.stringify(newMessage));
        // this.socketService.emit("updateMessage", newMessage);
        // this.store.dispatch(roomUpdateMessageAction({ messageId, correction: messageText }));

      else this.signalR.invokeMessageEvent("CreateMessage", JSON.stringify(newMessage));
      // else this.signalR.invokeMessageEvent("createMessage", messageText, room._id, this.chatService.me);
      // else this.signalR.invokeMessageEvent("createMessage", {message: messageText, room: room._id});
      // else this.socketService.emit("createMessage", { message: messageText, room: room._id, });
    }

    this.messageSent.next(true);
    this.isEditing = false;
  }

  public onOptionSelect(e: string, message: IMessage | null, roomId: string): void {
    if (message === null) return;
    switch (e) {
      case("delete"): {
        this.deleteMessage(message._id, roomId);
        break;
      }
      case("forward"): {
        this.dialog.open(RoomSelectDialogComponent, { data: message });
        break;
      }
    }
    this.chatService.showContextMenu.next(false);
  }
}
