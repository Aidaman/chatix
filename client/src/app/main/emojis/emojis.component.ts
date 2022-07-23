import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {EMOJI} from "../../shared/EMOJIS";
import {ChatService} from "../../shared/services/chat.service";

@Component({
  selector: 'app-emojis',
  templateUrl: './emojis.component.html',
  styleUrls: ['./emojis.component.scss']
})
export class EmojisComponent {
  @Output() closeParticipants: EventEmitter<any> = new EventEmitter<any>();
  public smiles: string[] = Object.values(EMOJI);

  constructor(public chatService: ChatService) {
  }

  public sendToInput(smile: string): void {
    this.chatService.message.next(smile);
    console.log(this.chatService.message.value)
  }

}
