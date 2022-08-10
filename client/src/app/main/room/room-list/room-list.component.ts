import { Component, } from "@angular/core";
import { IRoom } from "../../../shared/models/IRoom";
import { SocketService } from "../../../shared/services/socket.service";
import { ThemingService } from "../../../shared/services/theming.service";
import { BehaviorSubject, Observable, switchMap, } from "rxjs";
import { RoomService } from "../../../shared/services/room.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddingRoomComponent } from "../../../dialog/new-room-dialog/dialog-adding-room.component";
import { Router } from "@angular/router";
import { ChatService } from "../../../shared/services/chat.service";
import { Store } from "@ngrx/store";
import {
  chatGetAvailableRooms,
  roomSwitchAction
} from "../../../store/room/room-chat.actions";
import { SnackBarNotificationService } from "../../../shared/services/snack-bar-notification.service";
import { allRoomsSelector, isAllRoomsHasValue } from "../../../store/room/room-chat.selectors";

/*
* @description This component is responsible to show the list of rooms available for users
* @description It located in the mat drawer
* @description Using this user can navigate through rooms
*/
@Component({
  selector: "app-room-list",
  templateUrl: "./room-list.component.html",
  styleUrls: ["./room-list.component.scss"]
})
export class RoomListComponent  {
  public rooms$: Observable<IRoom[]> = this.store.select(isAllRoomsHasValue).pipe(
    switchMap((value) => {
      if (!value) {
        this.store.dispatch(chatGetAvailableRooms());
      }
      return this.store.select(allRoomsSelector);
    }),
  );

  public searchCondition: string = "public";

  public overallUnread: number = 0;

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

  /*
  * @description Opens modal window for creating a room
  */
  public createRoom(): void {
    const newRoomDialogRef = this.matDialog.open(DialogAddingRoomComponent);
    newRoomDialogRef.afterClosed().subscribe((value) => {
      //if the value is false - it means that user declined to create the room
      if (!value) return;
      const newRoom = {
        ...value,
        participants: [this.chatService.me, ...value.participants],
      };
      this.socketService.emit("createRoom", newRoom);
    });
  }

  public toggleSearch(): void {
    this.searchCondition = this.searchCondition.toLowerCase() === "public" ? "private" : "public";

    // this.isPublicRooms = !this.isPublicRooms;
    // this.searchRooms();
  }

  // public searchRooms() {
  //   this.socketService.emit("searchRoom", { title: this.searchText });
  //   this.store.dispatch(chatSearchRoomsActions());
  // }

  public closeList() {
    this.roomService.sideMenuOpened.next(false);
  }

  public navigateRoom(roomId: string) {
    this.store.dispatch(roomSwitchAction({ roomId }));
    this.router.navigate(["/chat", roomId]);
  }
}
