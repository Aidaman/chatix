import { Component, OnDestroy, OnInit } from "@angular/core";
import { IRoom } from "../../shared/models/IRoom";
import { SocketService } from "../../shared/services/socket.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogInvitationComponent } from "../../dialog/invitation-dialog/dialog-invitation.component";
import { ThemingService } from "../../shared/services/theming.service";
import { BehaviorSubject, lastValueFrom, Observable, switchMap, tap } from "rxjs";
import { RoomService } from "../../shared/services/room.service";
import { Store } from "@ngrx/store";
import { userAuthAction } from "../../store/user/user.actions";
import { allRoomsSelector, isAllRoomsHasValue } from "../../store/room/room-chat.selectors";
import { chatGetAvailableRooms } from "../../store/room/room-chat.actions";
import {ChatService} from "../../shared/services/chat.service";

/*
* @description This is the component that wraps room and room-list components
* @description It serves to listen to several socket events
*              that can happen outside the room component (e.g. new message)
*/
@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"]
})
export class ChatComponent implements OnInit, OnDestroy {
  public opened: BehaviorSubject<boolean> = this.chatService.sideMenuOpened;
  public theme: BehaviorSubject<string> = this.themingService.theme;
  public showEmojis: BehaviorSubject<boolean> = this.chatService.showEmoji;

  constructor(private store: Store,
              private chatService: ChatService,
              private socketService: SocketService,
              private themingService: ThemingService,
              public dialog: MatDialog,) {
  }

  public ngOnInit(): void {
    this.store.dispatch(userAuthAction());
    this.socketService.emit("getAllRooms", {});
    this.store.dispatch(chatGetAvailableRooms());

    this.socketService.listenInvitation().pipe(
      tap(value => this.openInvitation(value))
    ).subscribe();

    this.socketService.listenNewMessage().subscribe();

    this.socketService.listenNewRoom().subscribe();
    this.socketService.listenRoomDeleted().subscribe();
    this.socketService.listenRoomRenamed().subscribe()
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  /*
  * @description the function that opens modal window for invitation to the room
  */
  private async openInvitation(data: any): Promise<void> {
    const invitationDialogRef = this.dialog.open(DialogInvitationComponent,
      { hasBackdrop: true, data });

    const invitationResultSource$ = invitationDialogRef.afterClosed().pipe(tap((response) => {
      if (response) {
        if (response.isAgree)
          this.socketService.emit("acceptInvitation", { roomId: response.roomId });
        else
          this.socketService.emit("leaveRoom", { roomId: response.roomId });
      }
    }));

    await lastValueFrom(invitationResultSource$);
  }
}
