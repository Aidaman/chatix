import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {IOption} from "../../models/IOption";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-custom-context-menu',
  templateUrl: './custom-context-menu.component.html',
  styleUrls: ['./custom-context-menu.component.scss'],
})
export class CustomContextMenuComponent {
  @Output() optionSelect: EventEmitter<string> = new EventEmitter<string>();
  @Input() options: IOption[] = [];

  public mouseLocation: BehaviorSubject<{ left: number, top: number }> = this.chatService.contextMenuCoords;
  public isShown: BehaviorSubject<boolean> = this.chatService.showContextMenu

  constructor(private chatService: ChatService) {
  }

  @HostListener('document:click', ['$event'])
  clickedOutside(): void {
    this.chatService.showContextMenu.next(false);
  }

  public selectOption(optionId: string): void {
    this.optionSelect.emit(optionId);
  }

}
