import { Component, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../shared/services/socket.service";
import { ThemingService } from "../../shared/services/theming.service";
import { BehaviorSubject, lastValueFrom, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { userAuthAction } from "../../store/user/user.actions";
import { ChatService } from "../../shared/services/chat.service";
import { chatGetAvailableRooms } from "../../store/chat/chat.actions";

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
              private themingService: ThemingService,) {
  }

  public ngOnInit(): void {
    this.store.dispatch(userAuthAction());
    this.socketService.emit("getAllRooms", {});
    // this.store.dispatch(chatGetAvailableRooms());

    this.socketService.listenGetAllRooms().subscribe();
    this.socketService.listenNewMessage().subscribe();
    this.socketService.listenNewRoom().subscribe();
    this.socketService.listenRoomDeleted().subscribe();
    this.socketService.listenRoomRenamed().subscribe();
    this.socketService.listenSearchRoomsResult().subscribe();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
