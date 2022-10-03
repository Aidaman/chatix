import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IMessage } from "../../../shared/models/IMessage";
import { ChatService } from "../../../shared/services/chat.service";
import { ThemingService } from "../../../shared/services/theming.service";
import { BehaviorSubject, map, Observable,  } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ReadDialogComponent } from "src/app/dialog/read-dialog/read-dialog.component";

@Component({
  selector: "app-message-item",
  templateUrl: "./message-item.component.html",
  styleUrls: ["./message-item.component.scss"]
})
export class MessageItemComponent  {
  @Input() message!: IMessage;
  @Output() viewChange: EventEmitter<{ inView: boolean, id: string }> = new EventEmitter<{ inView: boolean, id: string, }>();

  public theme: BehaviorSubject<string> = this.themeService.theme;
  public me = this.chatService.getMe();
  // public currentRoom: Observable<IRoom | undefined> = this.store.select(roomByIdSelect(this.message?._id));

  constructor(private chatService: ChatService,
              private matDialog: MatDialog,
              private themeService: ThemingService,) {
  }

  public viewportChange(e: boolean): void {
    if (this.me !== this.message.creator?._id && !this.message.isSystemMessage && this.message.read.indexOf(this.me) === -1) {
      this.viewChange.emit({ inView: e, id: this.message._id, });
    }
  }

  public openReaders(){
    this.matDialog.open(ReadDialogComponent, { data: this.message });
  }
}
