import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IMessage } from "../../../shared/models/IMessage";
import { ChatService } from "../../../shared/services/chat.service";
import { ThemingService } from "../../../shared/services/theming.service";
import { BehaviorSubject, map, Observable, of, switchAll, switchMap, take } from "rxjs";
import { IOption } from "../../../shared/models/IOption";
import { SocketService } from "../../../shared/services/socket.service";
import { IRoom } from "../../../shared/models/IRoom";
import { Store } from "@ngrx/store";
import { currentRoomSelector } from "../../../store/room/room-chat.selectors";

@Component({
  selector: "app-message-item",
  templateUrl: "./message-item.component.html",
  styleUrls: ["./message-item.component.scss"]
})
export class MessageItemComponent  {
  @Input() message!: IMessage;
  @Output() viewChange: EventEmitter<{ inView: boolean, id: string }> = new EventEmitter<{ inView: boolean, id: string, }>();

  public theme: BehaviorSubject<string> = this.themeService.theme;
  public me = this.chatService.me;

  /*
  * @description This is the variable that generate list of who read the message
  */
  public menuItems: Observable<IOption[] | null> = this.store.select(currentRoomSelector()).pipe(
    map((value) => {
      const newArr = value?.users.filter((user) => this.message.read.indexOf(user._id) !== -1).map((value) => {
        return ({
          id: "user",
          title: value.name,
          icon: value.avatar,
        }) as IOption;
      });
      console.log(newArr);
      return newArr ?? null;
    })
  );
  // public currentRoom: Observable<IRoom | undefined> = this.store.select(roomByIdSelect(this.message?._id));

  constructor(private chatService: ChatService,
              private socketService: SocketService,
              private store: Store,
              private themeService: ThemingService,) {
  }

  public viewportChange(e: boolean): void {
    if (this.message.read.indexOf(this.me) === -1 && this.me !== this.message.creator?._id) {
      this.viewChange.emit({ inView: e, id: this.message._id, });
    }
  }

}
