import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IMessage} from "../../../shared/models/IMessage";
import {ChatService} from "../../../shared/services/chat.service";
import {ThemingService} from "../../../shared/services/theming.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
// export class MessageItemComponent implements OnInit {
export class MessageItemComponent implements OnInit {
  @Input() message!: IMessage;
  @Output() loadRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewChange: EventEmitter<{ inView: boolean, id: string }> = new EventEmitter<{ inView: boolean, id: string, }>();
  public theme: BehaviorSubject<string> = this.themeService.theme;
  public me = this.chatService.me;

  constructor(private chatService: ChatService,
              private themeService: ThemingService,) {
  }

  ngOnInit(): void {
  }

  public messageRequest(scroll?: boolean): void {
    this.loadRequest.emit(scroll);
  }

  public viewportChange(e: boolean): void {
    // console.log(this.message.read.indexOf(this.me) === -1 && this.me !== this.message.creator?.id, this.message.content);
    // console.log(this.message.read, this.chatService.me);
    // console.log(this.message.read.indexOf(this.chatService.me));
    // console.log(this.message.content, this.message.read.indexOf(this.chatService.me));
    if (this.message.read.indexOf(this.me) === -1 && this.me !== this.message.creator?._id) {
      console.log(this.message.read.indexOf(this.me) === -1, this.me, this.message.creator?._id, this.message);
      console.log("---------------------------------------------------------------------------------------------------------");
      this.viewChange.emit({inView: e, id: this.message._id,});
      console.log(this.message.content);
    }
  }
}
