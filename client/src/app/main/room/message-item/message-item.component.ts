import {Component, EventEmitter, Input, Output} from '@angular/core';
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
export class MessageItemComponent {
  @Input() message!: IMessage;
  @Output() viewChange: EventEmitter<{ inView: boolean, id: string }> = new EventEmitter<{ inView: boolean, id: string, }>();
  public theme: BehaviorSubject<string> = this.themeService.theme;
  public me = this.chatService.me;

  constructor(private chatService: ChatService,
              private themeService: ThemingService,) {
  }

  public viewportChange(e: boolean): void {
    if (this.message.read.indexOf(this.me) === -1 && this.me !== this.message.creator?._id) {
      this.viewChange.emit({inView: e, id: this.message._id,});
    }
  }
}
