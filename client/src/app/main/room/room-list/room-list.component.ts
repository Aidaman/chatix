import { Component, } from "@angular/core";
import { IRoom } from "../../../shared/models/IRoom";
import { SocketService } from "../../../shared/services/socket.service";
import { Observable, of, switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddingRoomComponent } from "../../../dialog/new-room-dialog/dialog-adding-room.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ChatService } from "../../../shared/services/chat.service";
import { Store } from "@ngrx/store";
import { ScrollService } from "../../../shared/services/scroll.service";
import { chatGetAvailableRooms, chatSearchRoomsActions } from "../../../store/chat/chat.actions";
import { allRoomsSelector, isAllRoomsHasValue } from "../../../store/chat/chat.selectors";
import {SignalRService} from "../../../shared/services/signal-r.service";
import {ModalsService} from "../../../shared/services/modals.service";

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
export class RoomListComponent {
  public currentRoomId$: Observable<string> = this.activeRoute.params.pipe(
    switchMap(({ id }) => of(String(id))));

  public rooms$: Observable<IRoom[]> = this.store.select(isAllRoomsHasValue).pipe(
    switchMap((value) => {
      if (!value) {
        this.socketService.emit("getAllRooms", {});
        // this.store.dispatch(chatGetAvailableRooms());
      }
      return this.store.select(allRoomsSelector);
    }),
  );

  public searchCondition: string = "public";

  public overallUnread: Observable<number> = this.chatService.overallUnread;

  public searchText: string = "";

  constructor(private socketService: SocketService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private chatService: ChatService,
              private scrollService: ScrollService,
              private store: Store,
              private modalsService: ModalsService) {
  }

  /*
  * @description Opens modal window for creating a room
  */
  public createRoom(): void {
    this.modalsService.createRoomDialog();
  }

  public toggleSearch(): void {
    this.searchCondition = this.searchCondition.toLowerCase() === "public" ? "private" : "public";
  }

  public searchRooms(searchText: string) {
    if (this.searchCondition.toLowerCase() === "public" && searchText.trim()){
      this.socketService.emit("searchRooms", { title: searchText.trim() });

    } else if(!this.searchText.trim() || this.searchCondition !== "public"){
      this.socketService.emit("getAllRooms", {});

    }
  }

  public closeList() {
    this.chatService.sideMenuOpened.next(false);
  }

  public navigateRoom(previousRoomId: string, roomId: string) {
    this.closeList();
    this.scrollService.previousRoomId.next(previousRoomId);
    this.router.navigate(["/chat", roomId]);
  }
}
