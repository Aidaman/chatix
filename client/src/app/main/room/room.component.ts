import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ThemingService } from "../../shared/services/theming.service";
import { RoomService } from "../../shared/services/room.service";
import { IRoom } from "../../shared/models/IRoom";
import { BehaviorSubject, filter, lastValueFrom, map, Observable, Subscription, switchMap, tap } from "rxjs";
import { IMessage } from "../../shared/models/IMessage";
import { SocketService } from "../../shared/services/socket.service";
import { IOption } from "../../shared/models/IOption";
import { ChatService } from "../../shared/services/chat.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogRoomSettingsComponent } from "../../dialog/room-configuration-dialog/dialog-room-settings.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  isAllRoomsHasValue,
  messagesSelector,
  roomByIdSelect
} from "../../store/room/room-chat.selectors";
import {
  chatGetAvailableRooms,
  roomGetAmountOfMessagesAction,
  roomGetMessagesAction,
  roomLoadMessagesAction, roomMessageRemoveAction, roomSwitchAction, roomUpdateMessageAction
} from "../../store/room/room-chat.actions";
import { DialogInvitingRoomComponent } from "../../dialog/invite-to-room-dialog/dialog-inviting-room.component";
import { IUser } from "../../shared/models/IUser";
import { ScrollTrackDirective } from "../../shared/directives/scroll-track.directive";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
  @ViewChild(ScrollTrackDirective) scrollBarTrack!: ScrollTrackDirective;

  private lastSelectedMessage: IMessage | null = null;
  private isEditing = false;

  public emojiExpanded: BehaviorSubject<boolean> = this.chatService.showEmoji;

  public messageForm: FormGroup = this.fb.group({
    message: [null, [Validators.required]]
  });

  public me = this.chatService.me;
  public theme: BehaviorSubject<string> = this.themingService.theme;

  public currentRoomUnreadCount: number = 0;
  public overallUnread: Observable<number> = this.chatService.overallUnread;

  public room$: Observable<IRoom | null> = this.activeRoute.params.pipe(
    switchMap(({ id }) => {
      return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          if (!value) {
            this.store.dispatch(chatGetAvailableRooms());
          }
          this.store.dispatch(roomSwitchAction({ roomId: id }));
          this.store.dispatch(roomGetMessagesAction({ roomId: id }));
          return this.store.select(roomByIdSelect(id));
        }),
        filter(Boolean),
      );
    }),
  );

  public messages$: Observable<IMessage[]> = this.activeRoute.params.pipe(
    switchMap(({ id }) => {
      if (id !== "common") return this.store.select(isAllRoomsHasValue).pipe(
        switchMap((value) => {
          if (!value) {
            this.store.dispatch(chatGetAvailableRooms());
          }
          this.store.dispatch(roomGetAmountOfMessagesAction({ roomId: id }));
          return this.store.select(messagesSelector);
        })
      );
      return this.roomService.messagesInCommon.asObservable();
    }),
    tap((messages) => {
      this.currentRoomUnreadCount = this.chatService.calculateUnread(messages);
      return messages;
    })
  );

  public menuItems: IOption[] = [
    {
      id: "edit",
      title: "Edit Message",
      icon: "edit"
    },
    {
      id: "delete",
      title: "Delete Message",
      icon: "delete"
    },
  ];

  constructor(private themingService: ThemingService,
              private socketService: SocketService,
              private chatService: ChatService,
              private matDialog: MatDialog,
              private router: Router,
              private fb: FormBuilder,
              private activeRoute: ActivatedRoute,
              private roomService: RoomService,
              private store: Store) {
  }

  ngOnInit(): void {
    // this.socketService.emit("searchRooms", {});

    this.socketService.listenUserLeft().subscribe();
    this.socketService.listenPrivacyChanged().subscribe();
    this.socketService.listenMessageDeleted().subscribe();
    this.socketService.listenMessageUpdated().subscribe();
    this.socketService.listenMessageRead().subscribe();

    this.socketService.listenUserJoined().subscribe();
  }

  private deleteMessage(messageId: string, roomId: string) {
    this.socketService.emit("deleteMessage", { messageId, roomId });
    this.store.dispatch(roomMessageRemoveAction({ messageId }));
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
    const msg = this.messageForm.get("message")?.value.trim() ?? "";
    if (event.code === "Enter") event.preventDefault();

    const newMessage = { messageId: this.lastSelectedMessage?._id, newContent: msg, roomId: room._id, };
    const messageId = this.lastSelectedMessage?._id as string;

    if (msg) {
      if (room._id === "common" && this.isEditing)
        this.roomService.editMessageInCommon(messageId, msg);

      else if (room._id !== "common" && this.isEditing) {
        this.socketService.emit("updateMessage", newMessage);
        this.store.dispatch(roomUpdateMessageAction({ messageId, correction: msg }));
      } else {
        this.socketService.emit("createMessage", { message: msg, room: room._id, });
        this.scrollBarTrack.scrollDown();
      }
    }

    this.messageForm.get("message")?.setValue("");
    this.isEditing = false;
  }

  /*
  * @description This event serves to detect weather user saw the message or not, if user saw, then it marks as read
  */
  public onViewportChange(event: { inView: boolean, id: string }, room: IRoom, messages: IMessage[]) {
    if (room._id !== "common") {
      if (event.inView) {
        this.socketService.emit("readMessage", { messageId: event.id });
        this.currentRoomUnreadCount = this.chatService.calculateUnread(messages);
      }
    }
  }

  public onMessageRightClick(message: IMessage): void {
    if (message.creator?._id === this.chatService.me) {
      this.lastSelectedMessage = message;
    }
  }

  /*
  * @description Opens modal window for configure room
  */
  public async openSettings(room: IRoom): Promise<void> {
    const matDialogRef = this.matDialog.open(DialogRoomSettingsComponent, { data: room });
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      //If Value is false - then no changes were made
      if (!value) return;
      if (value.delete) {
        this.socketService.emit("roomDelete", { roomId: value.roomId });
        this.router.navigate(["chat", "common"]);
      } else {
        if (value.newRoomTitle !== room.title)
          this.socketService.emit("renameRoom", { roomId: value._id, roomTitle: value.newRoomTitle });

        if (value.newIsPublic !== room.isPublic)
          this.socketService.emit("privacyChange", { roomId: value._id, roomPublicity: value.newIsPublic });

        if (value.deletedUsers && value.deletedUsers.length > 0) {
          value.deletedUsers.forEach((user: IUser) => {
            this.socketService.emit("deleteParticipant", { roomId: room._id, deletedUserId: user._id });
          });
        }
      }
    }));

    await lastValueFrom(afterClosedSource$);
  }

  /*
  * @description opens modal window for invite users into room
  */
  public async openInviteParticipantsDialog(room: IRoom): Promise<void> {
    const matDialogRef = this.matDialog.open(DialogInvitingRoomComponent,
      { data: room });
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      if (!value) return;
      else this.socketService.emit("inviteUsers", { roomId: value.roomId, participants: value.participants });
    }));

    await lastValueFrom(afterClosedSource$);
  }

  public exitRoom(room: IRoom) {
    this.socketService.emit("leaveRoom", { roomId: room._id });
  }

  /*
  * @description on the list of messages stands [scrollTrackDirective]
  * @description if it emits event - it means that user is already scrolled almost to the top of the page
  * @description so we need to load new messages if there is ones
  */
  public onScroll(roomId: string) {
    this.store.dispatch(roomLoadMessagesAction({ roomId }));
  }

  public onOptionSelect(e: string) {
    const messageId = this.lastSelectedMessage?._id as string;
    const roomId = this.lastSelectedMessage?.room as string;

    if (e === "edit") {
      this.isEditing = true;

      this.messageForm.get("message")?.setValue(this.lastSelectedMessage?.content ? this.lastSelectedMessage?.content : "");
    } else if (e === "delete") {
      this.deleteMessage(messageId, roomId);
    }
    this.chatService.showContextMenu.next(false);
  }
}
