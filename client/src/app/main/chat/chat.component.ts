import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {IRoom} from "../../shared/models/IRoom";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddingRoomComponent} from "../../dialog/adding-room/dialog-adding-room.component";
import {DialogInvitationComponent} from "../../dialog/invitation/dialog-invitation.component";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {MatBadge} from "@angular/material/badge";
import {ThemingService} from "../../shared/services/theming.service";
import {
  BehaviorSubject,
  map,
  Observable, switchMap,
  takeUntil
} from "rxjs";
import {RoomService} from "../../shared/services/room.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {userAuthAction} from "../../store/user/user.actions";
import {allRoomsSelector, isAllRoomsHasValue} from "../../store/room-chat/room-chat.selectors";
import {chatGetAvailableRooms, roomGetMessagesAction, roomSwitchAction} from "../../store/room-chat/room-chat.actions";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  public opened: BehaviorSubject<boolean> = this.roomService.sideMenuOpened;

  public me: string = this.localStorageService.getUser()['id'] as string;
  public selectedRoom!: IRoom;
  public unreadInRooms: object = {};
  public theme: BehaviorSubject<string> = this.themingService.theme;
  public listOfRooms: BehaviorSubject<IRoom[]> = this.chatService.rooms;
  public overallUnreadMessages: number = 0;

  public rooms$: Observable<IRoom[]> = this.store.select(isAllRoomsHasValue).pipe(
    switchMap((value) => {
      if (!value) {
        this.store.dispatch(chatGetAvailableRooms());
      }
      return this.store.select(allRoomsSelector);
    }),
  );

  private invitation$: Observable<boolean> = this.socketService.listenInvitation().pipe(
    map((data: any) => {
      console.log('these data from invitation$', data)
      if (!data) return false;

      return this.openInvitation(data);
    }),
    takeUntil(this.chatService.termination$),
  )

  constructor(public chatService: ChatService,
              private router: Router,
              private store: Store,
              private roomService: RoomService,
              private socketService: SocketService,
              private localStorageService: LocalStorageService,
              private authService: AuthService,
              private themingService: ThemingService,
              public dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
    this.store.dispatch(userAuthAction());

    this.socketService.emit('getAllRooms', {});
    this.store.dispatch(chatGetAvailableRooms());

    this.socketService.listenRoomDeleted().subscribe()
    this.socketService.listenNewMessage().subscribe();
    this.socketService.listenNewRoom().subscribe();
    this.socketService.listenRoomDeleted().subscribe();
  }

  ngOnDestroy(): void {
    this.chatService.termination$.next(1);
    this.chatService.termination$.complete();
    this.socketService.disconnect();
  }

  public recountUnread(): void {
    this.overallUnreadMessages = 0;
    Object.values(this.unreadInRooms).forEach((item) => {
      this.overallUnreadMessages += item;
    });
  }

  public openSideNav(): void {
    this.roomService.sideMenuOpened.next(!this.roomService.sideMenuOpened.value);
  }

  private openInvitation(data: any): boolean {
    const invitationDialogRef = this.dialog.open(DialogInvitationComponent, {
      width: '450px',
      height: '200px',
      hasBackdrop: true,
      data
    });
    // const aSub = invitationDialogRef.afterClosed().subscribe(response => {
    //     if (response) {
    //         if (response.isAgree) {
    //             this.socketService.emit('acceptInvitation', {
    //                 roomId: response.roomId
    //             });
    //         } else {
    //             this.socketService.emit('leaveRoom', {
    //                 roomId: response.roomId
    //             });
    //         }
    //     } else return false
    //     aSub.unsubscribe();
    return true
    // });
  }
}


