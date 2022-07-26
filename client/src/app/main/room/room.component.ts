import {Component, OnDestroy, OnInit} from "@angular/core";
import {ThemingService} from "../../shared/services/theming.service";
import {RoomService} from "../../shared/services/room.service";
import {IRoom} from "../../shared/models/IRoom";
import {BehaviorSubject, lastValueFrom, map, Observable, Subject, Subscription, switchMap, takeUntil, tap} from "rxjs";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {IMessage} from "../../shared/models/IMessage";
import {SocketService} from "../../shared/services/socket.service";
import {IOption} from "../../shared/models/IOption";
import {ChatService} from "../../shared/services/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogRoomSettingsComponent} from "../../dialog/room-settings/dialog-room-settings.component";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {isAllRoomsHasValue, messagesSelector, roomByIdSelect} from "../../store/room-chat/room-chat.selectors";
import {chatGetAvailableRooms, roomGetMessagesAction, roomSwitchAction} from "../../store/room-chat/room-chat.actions";
import {DialogInvitingRoomComponent} from "../../dialog/inviting-room/dialog-inviting-room.component";
import {IUser} from "../../shared/models/IUser";

@Component({
  selector: 'app-room',
  templateUrl: 'room.component.html',
  styleUrls: ['room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  private lastSelectedMessageId: string = '';
  private isEditing = false;
  private emojiSubscription!: Subscription;

  public theme: BehaviorSubject<string> = this.themingService.theme;

  public emoji$: Observable<string> = this.roomService.message.asObservable().pipe(
    map((value) => {
      this.message += value;
      return value
    })
  );
  public message: string = "";

  public room$: Observable<IRoom> = this.activeRoute.params.pipe(
    switchMap(({id})=>{
      return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          console.log("(Room Component) room$, select switchMap", id)
          if (!value){
            this.store.dispatch(chatGetAvailableRooms());
          }
          this.store.dispatch(roomGetMessagesAction({roomId: id, offset: 50}))
          return this.store.select(roomByIdSelect(id))
        })
      );
    }),
  )

  public messages$: Observable<IMessage[]> = this.activeRoute.params.pipe(
    switchMap(({id}) => {
      if (id !== 'common') return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value)=>{
          console.log("(Room Component) room$, select switchMap", id)
          if (!value){
            this.store.dispatch(chatGetAvailableRooms());
          }
          return this.store.select(messagesSelector);
        })
      )
      return [];
    })
  );
  public users: object[] = [];

  public me: string = this.localStorageService.getUser()['id'] as string;
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
              private localStorageService: LocalStorageService,
              private socketService: SocketService,
              private chatService: ChatService,
              private matDialog: MatDialog,
              private activeRoute: ActivatedRoute,
              private roomService: RoomService,
              private store: Store,) {
  }

  ngOnInit(): void {
    this.socketService.emit('searchRooms', {});
    this.emojiSubscription = this.emoji$.subscribe();

    this.socketService.listenUserLeft().subscribe();
    this.socketService.listenPrivacyChanged().subscribe();
  }

  ngOnDestroy(): void {
    this.emojiSubscription.unsubscribe();
    // this.messageSubscription.unsubscribe();
  }

  public toggleMatDrawer(): void {
    const newValue = !this.roomService.sideMenuOpened.value;
    this.roomService.sideMenuOpened.next(newValue);
  }

  public checkIsCommon(room: IRoom): boolean {
    return (room._id !== 'common' || room.isFavorites);
  }

  public isCreatedByMe(room: IRoom): boolean {
    return room.creator?.id === this.me;
  }

  public sendMessage(event: any, room: IRoom): void {
    const msg = this.message.trim();
    if (event.code === 'Enter') event.preventDefault();
    if (msg) {
      if (this.isEditing) {
        this.socketService.emit('updateMessage', {
          messageId: this.lastSelectedMessageId,
          newContent: msg,
          roomId: room._id,
        });
      } else {
        this.socketService.emit('createMessage', {
          message: msg,
          room: room._id,
        });
      }
    }
    this.message = '';
    this.isEditing = false;
  }

  public onViewportChange(event: any, room: IRoom, messages: IMessage[]) {
    if (room._id !== 'common') {
      if (event.inView) {
        this.socketService.emit('readMessage', {messageId: event.id});
        this.roomService.calculateUnread(messages);
      }
    }
  }

  public onMessageRightClick(message: IMessage): void {
    if (message.creator?.id === this.me) {
      this.chatService.lastSelectedMessageId.next(message._id);
    }
  }

  public async openSettings(room: IRoom): Promise<void> {
    // const terminate: Subject<boolean> = new Subject<boolean>();

    const matDialogRef = this.matDialog.open(DialogRoomSettingsComponent, {data: room});
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      console.log("room settings closed, this is the resulting value", value)

      if (value.delete)
        this.socketService.emit('roomDelete', {roomId: value.roomId});

      else {
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
    }))

    await lastValueFrom(afterClosedSource$);
    // terminate.next(true);
    // terminate.complete();
  }

  public async openInviteParticipantsDialog(room: IRoom): Promise<void> {
    const matDialogRef = this.matDialog.open(DialogInvitingRoomComponent, {height: '500px', width: '500px', data: room});
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      if(!value) return;
      else  this.socketService.emit('inviteUsers', {roomId: value.roomId, participants: value.participants});
    }));

    await lastValueFrom(afterClosedSource$);
  }

  public exitRoom(room: IRoom) {
    this.socketService.emit('leaveRoom', {roomId: room._id});
  }

  onInput(e: any) {
    console.log(e);
    // this.message += e.data;
  //  Get selection использовать
  //  Get position использовать
  }
}
