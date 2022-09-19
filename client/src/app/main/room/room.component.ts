import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {RoomService} from "../../shared/services/room.service";
import {IRoom} from "../../shared/models/IRoom";
import {
  asyncScheduler,
  BehaviorSubject,
  filter, map,
  Observable,
  observeOn,
  switchMap,
  tap
} from "rxjs";
import {IMessage} from "../../shared/models/IMessage";
import {SocketService} from "../../shared/services/socket.service";
import {IOption} from "../../shared/models/IOption";
import {ChatService} from "../../shared/services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {
  currentRoomSelector,
  isAllRoomsHasValue,
  roomByIdSelect
} from "../../store/chat/chat.selectors";
import {hasRoomMessagesValueSelector, messagesSelector,} from "../../store/room/room.selectors";
import {
  roomGetAmountOfMessagesAction,
  roomGetMessagesAction,
  roomLoadMessagesAction,
} from "../../store/room/room.actions";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScrollService} from "../../shared/services/scroll.service";
import {chatGetAvailableRooms, chatRoomSwitchAction} from "../../store/chat/chat.actions";
import {MessagesService} from "../../shared/services/messages.service";
import {ModalsService} from "../../shared/services/modals.service";
import {IUser} from "../../shared/models/IUser";
import {SignalRService} from "../../shared/services/signal-r.service";

/*
* @description This component is responsible for displaying the room and messages in it
* @description By the most part this is the central component in the whole app
*/
@Component({
  selector: "app-room",
  templateUrl: "room.component.html",
  styleUrls: ["room.component.scss"],
})
export class RoomComponent implements OnInit {
  @ViewChild("messagesList") private messagesList!: ElementRef;
  private DOMChanges!: MutationObserver;

  private lastSelectedMessage: IMessage | null = null;

  public openMutationObserver$ = new BehaviorSubject<boolean>(false);

  public emojiExpanded: BehaviorSubject<boolean> = this.chatService.showEmoji;

  public messageForm: FormGroup = this.fb.group({
    message: [null, [Validators.required]]
  });

  public currentRoomUnreadCount: number = 0;
  public overallUnread: Observable<number> = this.chatService.overallUnread;

  public room$: Observable<IRoom | null> = this.activeRoute.params.pipe(
    tap(() => {
      // eslint-disable-next-line no-unused-expressions
      this.DOMChanges && this.DOMChanges.disconnect();
    }),
    switchMap(({id}) => {
      return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          if (!value) {
            this.socketService.emit("getAllRooms", {});
          }
          return this.store.select(roomByIdSelect(id));
        }),
        map((room: IRoom | null) => {
          if (room === null) return;
          if (room.users.find((user: IUser) => user._id === this.chatService.me) === undefined) {
            this.socketService.emit("joinRoom", {roomId: room._id});
            return room;
          }

          this.store.dispatch(chatRoomSwitchAction({roomId: id}));
          this.store.dispatch(roomGetAmountOfMessagesAction({roomId: id}));
          this.currentRoomUnreadCount = room.unread;
          return room;
        }),
        filter(Boolean),
      );
    }),
    tap(() => {
      if (!this.openMutationObserver$.getValue()) {
        this.openMutationObserver$.next(true);
      }
    })
  );

  public messages$: Observable<IMessage[]> = this.activeRoute.params.pipe(
    switchMap(({id}) => {
      if (id === "common") return this.roomService.messagesInCommon.asObservable();
      else return this.store.select(hasRoomMessagesValueSelector()).pipe(
        switchMap(() => {
          this.store.dispatch(roomGetMessagesAction({roomId: id}));
          return this.store.select(messagesSelector);
        })
      );
    }),
    tap((messages) => {
      if (messages.length > 0)
        this.chatService.lastMessageCreatorId = messages[messages.length - 1].creator?._id ?? "";

      return messages;
    })
  );

  public menuItems: IOption[] = [
    {
      id: "edit",
      title: "Edit Message",
      icon: "edit",
      isForMe: true,
    },
    {
      id: "delete",
      title: "Delete Message",
      icon: "delete",
      isForMe: true,
    },
    {
      id: "forward",
      title: "Forward Message",
      icon: "redo",
      isForMe: false,
    },
    {
      id: "reply",
      title: "Reply Message",
      icon: "reply",
      isForMe: false,
    },
  ];

  constructor(private socketService: SocketService,
              private chatService: ChatService,
              private messagesService: MessagesService,
              private modalsService: ModalsService,
              private roomService: RoomService,
              private scrollService: ScrollService,
              private router: Router,
              private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private store: Store,
              private signalRService: SignalRService) {
  }

  ngOnInit(): void {
    this.openMutationObserver$.pipe(observeOn(asyncScheduler)).subscribe((isOpened: boolean) => {
      if (isOpened) {
        const element = this.messagesList.nativeElement;
        this.DOMChanges = new MutationObserver((mutations) => {
          if (this.messagesService.messageSent.getValue()) {
            this.scrollService.scrollDown$.next(true);
          } else this.scrollService.scrollDown$.next(false);
        });
        this.DOMChanges.observe(element, {childList: true});
      }
    });
  }

  public toggleMatDrawer(): void {
    const newValue = !this.chatService.sideMenuOpened.value;
    this.chatService.sideMenuOpened.next(newValue);
  }

  public toggleEmojis() {
    const newValue = !this.chatService.showEmoji.value;
    this.chatService.showEmoji.next(newValue);
  }

  public checkIsCommon(room: IRoom): boolean {
    return (room._id !== "common" || room.isFavorites);
  }

  public sendMessage(event: any, room: IRoom): void {
    if (event.code === "Enter") event.preventDefault();

    const messageText = this.messageForm.get("message")?.value.trim() ?? "";
    const messageId = this.lastSelectedMessage?._id as string;
    this.messagesService.sendMessage(room, messageText, messageId);

    this.messageForm.get("message")?.setValue("");
  }

  /*
  * @description This event serves to detect weather user saw the message or not, if user saw, then it marks as read
  */
  public onViewportChange(event: { inView: boolean, id: string }, room: IRoom, messages: IMessage[]) {
    if (room._id !== "common") {
      if (event.inView) {
        // this.socketService.emit("readMessage", {messageId: event.id});
        this.signalRService.invokeMessageEvent("ReadMessage", {userId: this.chatService.me, messageId: event.id});
        this.currentRoomUnreadCount = this.chatService.calculateUnread(messages);
      }
    }
  }

  public onMessageRightClick(message: IMessage): void {
    this.lastSelectedMessage = message;
  }

  public exitRoom(room: IRoom) {
    this.socketService.emit("leaveRoom", {roomId: room._id});
  }

  /*
  * @description on the list of messages stands [scrollTrackDirective]
  * @description if it emits event - it means that user is already scrolled almost to the top of the page
  * @description so we need to load new messages if there is ones
  */
  public onScroll(roomId: string) {
    this.store.dispatch(roomLoadMessagesAction({roomId}));
  }

  public onOptionSelect(e: string) {
    const messageId = this.lastSelectedMessage?._id as string;
    const roomId = this.lastSelectedMessage?.room as string;

    if (e === "edit") {
      this.messagesService.isEditing = true;
      this.messageForm.get("message")?.setValue(this.lastSelectedMessage?.content ? this.lastSelectedMessage?.content : "");
      this.chatService.showContextMenu.next(false);
    } else this.messagesService.onOptionSelect(e, this.lastSelectedMessage, roomId);

    this.chatService.showContextMenu.next(false);
  }

  public openSettings(room: IRoom): void {
    this.modalsService.openSettings(room);
  }

  public openInviteParticipantsDialog(room: IRoom): void {
    this.modalsService.openInviteParticipantsDialog(room);
  }
}
