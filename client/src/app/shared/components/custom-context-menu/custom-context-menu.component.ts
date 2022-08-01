import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {IOption} from "../../models/IOption";
import {IMessage} from "../../models/IMessage";
import {IRoom} from "../../models/IRoom";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-custom-context-menu',
  templateUrl: './custom-context-menu.component.html',
  styleUrls: ['./custom-context-menu.component.scss'],
  host: {
    '(document:click)': 'clickedOutside()'
  },
})
export class CustomContextMenuComponent {
  @Output() optionSelect: EventEmitter<string> = new EventEmitter<string>();
  @Input() options: IOption[] = [];

  public mouseLocation: BehaviorSubject<{ left: number, top: number }> = this.chatService.contextMenuCoords;
  public isShown: BehaviorSubject<boolean> = this.chatService.showContextMenu

  constructor(private chatService: ChatService) {
  }

  public clickedOutside(): void {
    this.chatService.showContextMenu.next(false);
  }

  public selectOption(optionId: string): void {
    this.optionSelect.emit(optionId);
  }

}
