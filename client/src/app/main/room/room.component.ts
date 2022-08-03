import {Component, OnDestroy, OnInit} from "@angular/core";
import {ThemingService} from "../../shared/services/theming.service";
import {RoomService} from "../../shared/services/room.service";
import {IRoom} from "../../shared/models/IRoom";
import {BehaviorSubject, filter, lastValueFrom, Observable, Subscription, switchMap, tap} from "rxjs";
import {IMessage} from "../../shared/models/IMessage";
import {SocketService} from "../../shared/services/socket.service";
import {IOption} from "../../shared/models/IOption";
import {ChatService} from "../../shared/services/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogRoomSettingsComponent} from "../../dialog/room-settings/dialog-room-settings.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {
  currentRoom,
  isAllRoomsHasValue,
  messagesSelector,
  roomByIdSelect
} from "../../store/room-chat/room-chat.selectors";
import {
  chatGetAvailableRooms,
  roomGetAmountOfMessagesAction,
  roomGetMessagesAction,
  roomLoadMessagesAction, roomMessageRemoveAction, roomSwitchAction, roomUpdateMessageAction
} from "../../store/room-chat/room-chat.actions";
import {DialogInvitingRoomComponent} from "../../dialog/inviting-room/dialog-inviting-room.component";
import {IUser} from "../../shared/models/IUser";

@Component({
  selector: 'app-room',
  templateUrl: 'room.component.html',
  styleUrls: ['room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  private isEditing = false;
  private emojiSubscription!: Subscription;
  private lastSelectedMessage: IMessage | null = null;

  public me = this.chatService.me;
  public theme: BehaviorSubject<string> = this.themingService.theme;

  public emoji$: Observable<string> = this.roomService.emoji.asObservable();
  public message: string = "";

  public currentRoomUnreadCount: number = 0;

  public room$: Observable<IRoom | undefined> = this.activeRoute.params.pipe(
    switchMap(({id}) => {
      return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          if (!value) {
            this.store.dispatch(chatGetAvailableRooms());
            this.store.dispatch(roomSwitchAction({roomId: id}))
          }
          this.store.dispatch(roomSwitchAction({roomId: id}));
          this.store.dispatch(roomGetMessagesAction({roomId: id}));
          return this.store.select(roomByIdSelect(id));
        }),
        filter(Boolean),
      );
    }),
  )

  // This is for the resolver update
  // public room$: Observable<IRoom | null> = this.store.select(currentRoom());

  public messages$: Observable<IMessage[]> = this.activeRoute.params.pipe(
    switchMap(({id}) => {
      if (id !== 'common') return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          if (!value) {
            this.store.dispatch(chatGetAvailableRooms());
          }
          this.store.dispatch(roomGetAmountOfMessagesAction({roomId: id}));
          return this.store.select(messagesSelector);
        })
      )
      return [];
    }),
    tap((messages)=> {
      this.currentRoomUnreadCount = this.chatService.calculateUnread(messages);
      return messages;
    })
  );

  // This is for the resolver update
  // public messages$: Observable<IMessage[]> = this.store.select(messagesSelector).pipe(
  //   tap((messages) => {
  //     this.currentRoomUnreadCount = this.chatService.calculateUnread(messages);
  //     return messages;
  //   })
  // );


  public menuItems: IOption[] = [
    {
      id: 'edit',
      title: 'Edit Message',
      icon: 'edit'
    },
    {
      id: 'delete',
      title: 'Delete Message',
      icon: 'delete'
    },
  ];

  constructor(private themingService: ThemingService,
              private socketService: SocketService,
              private chatService: ChatService,
              private matDialog: MatDialog,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private roomService: RoomService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.socketService.emit('searchRooms', {});
    this.emojiSubscription = this.emoji$.subscribe((value: string) => {
      this.message += value;
    });

    this.socketService.listenUserLeft().subscribe();
    this.socketService.listenPrivacyChanged().subscribe();
    this.socketService.listenMessageDeleted().subscribe();
    this.socketService.listenMessageUpdated().subscribe();
    this.socketService.listenMessageRead().subscribe();
  }

  ngOnDestroy(): void {
    this.emojiSubscription.unsubscribe();
  }

  private deleteMessage(messageId: string, roomId: string) {
    this.socketService.emit('deleteMessage', {messageId, roomId});
    this.store.dispatch(roomMessageRemoveAction({messageId}));
  }

  public toggleMatDrawer(): void {
    const newValue = !this.roomService.sideMenuOpened.value;
    this.roomService.sideMenuOpened.next(newValue);
  }

  public checkIsCommon(room: IRoom): boolean {
    return (room._id !== 'common' || room.isFavorites);
  }

  public isCreatedByMe(id: string | undefined): boolean {
    return this.chatService.me === id;
  }

  public sendMessage(event: any, room: IRoom): void {
    const msg = this.message.trim();
    if (event.code === 'Enter') event.preventDefault();
    if (msg && this.isEditing) {
      const newMessage = {messageId: this.lastSelectedMessage?._id, newContent: msg, roomId: room._id,}
      const messageId = this.lastSelectedMessage?._id as string;
      this.socketService.emit('updateMessage', newMessage);
      this.store.dispatch(roomUpdateMessageAction({messageId, correction: msg}));
    } else if (msg) {
      this.socketService.emit('createMessage', {message: msg, room: room._id,});
    }

    this.message = '';
    this.isEditing = false;
  }

  public onViewportChange(event: { inView: boolean, id: string }, room: IRoom, messages: IMessage[]) {
    if (room._id !== 'common') {
      if (event.inView) {
        this.socketService.emit('readMessage', {messageId: event.id});
        this.currentRoomUnreadCount = this.chatService.calculateUnread(messages);
      }
    }
  }

  public onMessageRightClick(e: MouseEvent, message: IMessage): void {
    e.preventDefault();
    if (this.isCreatedByMe(message.creator?._id)) {
      this.lastSelectedMessage = message;
      this.chatService.contextMenuCoords.next({top: e.y, left: e.x});
    }
  }

  public async openSettings(room: IRoom): Promise<void> {
    const matDialogRef = this.matDialog.open(DialogRoomSettingsComponent, {data: room});
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      if (value.delete) {
        this.socketService.emit('roomDelete', {roomId: value.roomId});
        this.router.navigate(['chat', 'common']);
      } else {
        if (value.newRoomTitle !== room.title)
          this.socketService.emit('renameRoom', {roomId: value._id, roomTitle: value.newRoomTitle});

        if (value.newIsPublic !== room.isPublic)
          this.socketService.emit('privacyChange', {roomId: value._id, roomPublicity: value.newIsPublic});

        if (value.deletedUsers && value.deletedUsers.length > 0) {
          value.deletedUsers.forEach((user: IUser) => {
            this.socketService.emit('deleteParticipant', {roomId: room._id, deletedUserId: user._id});
          });
        }
      }
    }));

    await lastValueFrom(afterClosedSource$);
  }

  public async openInviteParticipantsDialog(room: IRoom): Promise<void> {
    const matDialogRef = this.matDialog.open(DialogInvitingRoomComponent,
      {height: '500px', width: '500px', data: room});
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      if (!value) return;
      else this.socketService.emit('inviteUsers', {roomId: value.roomId, participants: value.participants});
    }));

    await lastValueFrom(afterClosedSource$);
  }

  public exitRoom(room: IRoom) {
    this.socketService.emit('leaveRoom', {roomId: room._id});
  }

  public onScroll(roomId: string) {
    this.store.dispatch(roomLoadMessagesAction({roomId}));
  }

  public onOptionSelect(e: string) {
    console.log(e);
    const messageId = this.lastSelectedMessage?._id as string;
    const roomId = this.lastSelectedMessage?.room as string;

    if (e === "edit") {
      this.isEditing = true;
      this.message = this.lastSelectedMessage?.content ? this.lastSelectedMessage?.content : "";
    } else if (e === "delete") {
      this.deleteMessage(messageId, roomId);
    }
    this.chatService.showContextMenu.next(false);
  }
}
