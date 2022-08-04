import {Component, OnDestroy, OnInit} from '@angular/core';
import {IRoom} from "../../shared/models/IRoom";
import {SocketService} from "../../shared/services/socket.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogInvitationComponent} from "../../dialog/invitation-dialog/dialog-invitation.component";
import {ThemingService} from "../../shared/services/theming.service";
import {BehaviorSubject, lastValueFrom, Observable, switchMap, tap} from "rxjs";
import {RoomService} from "../../shared/services/room.service";
import {Store} from "@ngrx/store";
import {userAuthAction} from "../../store/user/user.actions";
import {allRoomsSelector, isAllRoomsHasValue} from "../../store/room-chat/room-chat.selectors";
import {chatGetAvailableRooms} from "../../store/room-chat/room-chat.actions";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  public opened: BehaviorSubject<boolean> = this.roomService.sideMenuOpened;

  public theme: BehaviorSubject<string> = this.themingService.theme;

  public rooms$: Observable<IRoom[]> = this.store.select(isAllRoomsHasValue).pipe(
    switchMap((value) => {
      if (!value) {

        this.store.dispatch(chatGetAvailableRooms());
      }
      return this.store.select(allRoomsSelector);
    }),
  );

  constructor(private store: Store,
              private roomService: RoomService,
              private socketService: SocketService,
              private themingService: ThemingService,
              public dialog: MatDialog,) {
  }

  public ngOnInit(): void {
    this.store.dispatch(userAuthAction());
    this.socketService.emit('getAllRooms', {});
    this.store.dispatch(chatGetAvailableRooms());

    this.socketService.listenInvitation().pipe(
      tap(value => this.openInvitation(value))
    ).subscribe();

    this.socketService.listenNewMessage().subscribe();

    this.socketService.listenNewRoom().subscribe();
    this.socketService.listenRoomDeleted().subscribe();
    this.socketService.listenRoomRenamed().subscribe();
    // this.socketService.listenUserLeft().subscribe()
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  // public recountUnread(): void {
  //   this.overallUnreadMessages = 0;
  //   Object.values(this.unreadInRooms).forEach((item) => {
  //     this.overallUnreadMessages += item;
  //   });
  // }

  private async openInvitation(data: any): Promise<void> {
    const invitationDialogRef = this.dialog.open(DialogInvitationComponent,
      {width: '450px', height: '200px', hasBackdrop: true, data});

    const invitationResultSource$ = invitationDialogRef.afterClosed().pipe(tap((response) => {
      if (response) {
        if (response.isAgree)
          this.socketService.emit('acceptInvitation', {roomId: response.roomId});
        else
          this.socketService.emit('leaveRoom', {roomId: response.roomId});
      }
    }))

    await lastValueFrom(invitationResultSource$);
  }
}
