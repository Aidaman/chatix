import { Component, OnInit, } from "@angular/core";
import { IRoom } from "../../../shared/models/IRoom";
import { SocketService } from "../../../shared/services/socket.service";
import { debounceTime, lastValueFrom, Observable, of, switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { DialogAddingRoomComponent } from "../../../dialog/new-room-dialog/dialog-adding-room.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ChatService } from "../../../shared/services/chat.service";
import { Store } from "@ngrx/store";
import { ScrollService } from "../../../shared/services/scroll.service";
import { chatGetAvailableRooms, chatSearchRoomsActions } from "../../../store/chat/chat.actions";
import { allRoomsSelector, isAllRoomsHasValue } from "../../../store/chat/chat.selectors";
import { SignalRService } from "../../../shared/services/signal-r.service";
import { ModalsService } from "../../../shared/services/modals.service";
import { FormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

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
export class RoomListComponent implements OnInit {
  public currentRoomId$: Observable<string> = this.activeRoute.params.pipe(
    switchMap(({ id }) => of(String(id))));
  public rooms$: Observable<IRoom[]> = this.store.select(allRoomsSelector);
  public searchRoomsForm: UntypedFormGroup = this.fb.group({
    title: [""],
  });

  public isPublic: boolean = true;
  public overallUnread: Observable<number> = this.chatService.overallUnread;

  // public searchText: string = "";

  constructor(private socketService: SocketService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private chatService: ChatService,
              private scrollService: ScrollService,
              private store: Store,
              private fb: FormBuilder,
              private modalsService: ModalsService,) {
  }

  async ngOnInit() {
    this.searchRoomsForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(({ title }) => {
        if (title.trim()) {
          this.store.dispatch(chatSearchRoomsActions({ title }));
        } else {
          console.log("title is empty string");
          this.store.dispatch(chatGetAvailableRooms({ isPublic: this.isPublic }));
        }
      });
  }

  /*
  * @description Opens modal window for creating a room
  */
  public createRoom(): void {
    this.modalsService.createRoomDialog();
  }

  public toggleSearch(): void {
    // this.searchCondition = this.searchCondition.toLowerCase() === "public" ? "private" : "public";
    this.isPublic = !this.isPublic;
    this.store.dispatch(chatGetAvailableRooms({ isPublic: this.isPublic }));
  }

  public closeList() {
    this.chatService.sideMenuOpened.next(false);
  }

  public navigateRoom(previousRoomId: string, roomId: string) {
    this.closeList();
    // this.scrollService.previousRoomId.next(previousRoomId);
    this.router.navigate(["/chat", roomId]);
  }
}
