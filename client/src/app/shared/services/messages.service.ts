import { Injectable } from "@angular/core";
import { RoomSelectDialogComponent } from "../../dialog/room-select-dialog/room-select-dialog.component";
import { roomMessageRemoveAction, roomUpdateMessageAction } from "../../store/room/room.actions";
import { SocketService } from "./socket.service";
import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ChatService } from "./chat.service";
import { IRoom } from "../models/IRoom";
import { RoomService } from "./room.service";

@Injectable({
  providedIn: "root"
})
export class MessagesService {
  public isEditing: boolean = false;

  constructor(private socketService: SocketService,
              private chatService: ChatService,
              private roomService: RoomService,
              private store: Store,
              private dialog: MatDialog) { }

  private deleteMessage(messageId: string, roomId: string) {
    this.socketService.emit("deleteMessage", { messageId, roomId });
    this.store.dispatch(roomMessageRemoveAction({ messageId }));
  }

  public sendMessage(room: IRoom, messageText: string, messageId: string){
    const newMessage = { messageId: messageId, newContent: messageText, roomId: room._id, };

    if (messageText) {
      if (room._id === "common" && this.isEditing) {
        this.roomService.editMessageInCommon(messageId, messageText);
      }

      else if (room._id !== "common" && this.isEditing) {
        this.socketService.emit("updateMessage", newMessage);
        this.store.dispatch(roomUpdateMessageAction({ messageId, correction: messageText }));

      } else {
        this.socketService.emit("createMessage", { message: messageText, room: room._id, });
      }
    }

    this.isEditing = false;
  }

  public onOptionSelect(e: string, messageId: string, roomId: string): void {
    switch (e) {
      case("delete"): {
        this.deleteMessage(messageId, roomId);
        break;
      }
      case("forward"): {
        this.dialog.open(RoomSelectDialogComponent, { data: messageId });
        break;
      }
    }
    this.chatService.showContextMenu.next(false);
  }
}
