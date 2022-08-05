import { Component, Input } from "@angular/core";
import { IRoom } from "../../../shared/models/IRoom";
import { SocketService } from "../../../shared/services/socket.service";
import { ThemingService } from "../../../shared/services/theming.service";
import { BehaviorSubject, Observable } from "rxjs";
import { RoomService } from "../../../shared/services/room.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddingRoomComponent } from "../../../dialog/new-room-dialog/dialog-adding-room.component";
import { Router } from "@angular/router";
import { ChatService } from "../../../shared/services/chat.service";
import { Store } from "@ngrx/store";
import { chatSearchRoomsActions, roomSwitchAction } from "../../../store/room-chat/room-chat.actions";
import { SnackBarNotificationService } from "../../../shared/services/snack-bar-notification.service";

/*
* Make tabs for rooms: admin, private, all
*/

/*
  this component used to show list of rooms$ and allows user to switch current room-chat
*/
@Component({
  selector: "app-room-list",
  templateUrl: "./room-list.component.html",
  styleUrls: ["./room-list.component.scss"]
})
export class RoomListComponent {
  @Input() rooms: IRoom[] = [];

  //This object is structured like that: {roomId: amountOfUnread}
  public unread: object = {};

  public searchText: string = "";
  public isPublicRooms: boolean = false;
  public theme: BehaviorSubject<string> = this.themingService.theme;

  constructor(private socketService: SocketService,
              private roomService: RoomService,
              private router: Router,
              private chatService: ChatService,
              private store: Store,
              private matDialog: MatDialog,
              private snackBar: SnackBarNotificationService,
              private themingService: ThemingService) {
  }

  public createRoom(): void {
    const newRoomDialogRef = this.matDialog.open(DialogAddingRoomComponent);
    newRoomDialogRef.afterClosed().subscribe((value) => {
      if (!value) {
        this.snackBar.openSnackBar("Room has not been created", "Ok");
        return;
      }
      const newRoom = {
        ...value,
        participants: [this.chatService.me, ...value.participants],
      };
      this.socketService.emit("createRoom", newRoom);
    });
  }

  public toggleSearch(): void {
    this.isPublicRooms = !this.isPublicRooms;
    this.searchRooms();
  }

  public searchRooms() {
    this.socketService.emit("searchRoom", { title: this.searchText });
    this.store.dispatch(chatSearchRoomsActions());
  }

  public closeList() {
    this.roomService.sideMenuOpened.next(false);
  }

  public navigateRoom(roomId: string) {
    this.store.dispatch(roomSwitchAction({ roomId }));
    this.router.navigate(["/chat", roomId]);
  }
}
