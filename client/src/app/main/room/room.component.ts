import {AfterViewChecked, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ThemingService} from "../../shared/services/theming.service";
import {RoomService} from "../../shared/services/room.service";
import {IRoom} from "../../shared/models/IRoom";
import {BehaviorSubject, lastValueFrom, Observable, Subscription, switchMap, tap} from "rxjs";
import {IMessage} from "../../shared/models/IMessage";
import {SocketService} from "../../shared/services/socket.service";
import {IOption} from "../../shared/models/IOption";
import {ChatService} from "../../shared/services/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogRoomSettingsComponent} from "../../dialog/room-settings/dialog-room-settings.component";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {isAllRoomsHasValue, messagesSelector, roomByIdSelect} from "../../store/room-chat/room-chat.selectors";
import {
  chatGetAvailableRooms,
  roomGetAmountOfMessagesAction,
  roomGetMessagesAction
} from "../../store/room-chat/room-chat.actions";
import {DialogInvitingRoomComponent} from "../../dialog/inviting-room/dialog-inviting-room.component";
import {IUser} from "../../shared/models/IUser";
import {ScrollTrackDirective} from "../../shared/directives/scroll-track.directive";

@Component({
  selector: 'app-room',
  templateUrl: 'room.component.html',
  styleUrls: ['room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy, AfterViewChecked{
  @ViewChild(ScrollTrackDirective) scrollDir!: ScrollTrackDirective;

  private lastSelectedMessageId: string = '';
  private isEditing = false;
  private emojiSubscription!: Subscription;

  public theme: BehaviorSubject<string> = this.themingService.theme;

  public emoji$: Observable<string> = this.roomService.message.asObservable();
  public message: string = "";

  public room$: Observable<IRoom> = this.activeRoute.params.pipe(
    switchMap(({id}) => {
      return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          if (!value) {
            this.store.dispatch(chatGetAvailableRooms());
          }
          this.socketService.roomId = id;
          this.socketService.limit = 50;
          this.store.dispatch(roomGetMessagesAction({roomId: id, offset: 0, limit: this.socketService.limit}));
          return this.store.select(roomByIdSelect(id))
        })
      );
    }),
  )

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
    })
  );

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
              private activeRoute: ActivatedRoute,
              private roomService: RoomService,
              private store: Store) {
  }

  ngOnInit(): void {
    this.socketService.emit('searchRooms', {});
    this.emojiSubscription = this.emoji$.subscribe((value: string)=>{
      this.message += value;
    });

    this.socketService.listenUserLeft().subscribe();
    this.socketService.listenPrivacyChanged().subscribe();
    this.socketService.listenMessageRead().subscribe();
  }

  ngAfterViewChecked(): void {
    if (this.scrollDir.counter < 20){
      this.scrollDir.reset();
      this.scrollDir.counter++;
    }
  }

  ngOnDestroy(): void {
    this.emojiSubscription.unsubscribe();
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
    if (msg && this.isEditing)
      this.socketService.emit('updateMessage', {
        messageId: this.lastSelectedMessageId,  newContent: msg,  roomId: room._id,
      });
    else if (msg) {
      this.socketService.emit('createMessage', {message: msg, room: room._id,});
      this.scrollDir.reset();
    }

    this.message = '';
    this.isEditing = false;
    this.scrollDir.reset();
  }

  public onViewportChange(event: any, room: IRoom, messages: IMessage[]) {
    if (room._id !== 'common') {
      console.log("(on Viewport Change) event, room, messages:", event, room, messages);
      if (event.inView) {
        this.socketService.emit('readMessage', {messageId: event.id});
        this.roomService.calculateUnread(messages);
      }
    }
  }

  public onMessageRightClick(message: IMessage): void {
    if (message.creator?.id === this.chatService.me) {
      this.chatService.lastSelectedMessageId.next(message._id);

    }
  }

  public async openSettings(room: IRoom): Promise<void> {
    const matDialogRef = this.matDialog.open(DialogRoomSettingsComponent, {data: room});
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
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
}
