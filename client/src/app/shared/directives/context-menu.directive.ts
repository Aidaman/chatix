import { Directive, HostListener, Input } from "@angular/core";
import { ChatService } from "../services/chat.service";

@Directive({
    selector: "[app-context-menu]",
})
export class ContextMenuDirective {
  @Input() isMyMessage: boolean = true;

  constructor(private chatService: ChatService) {
  }

  @HostListener("contextmenu", ["$event"])
  rightClicked(event: MouseEvent): void {
    event.preventDefault();
    this.chatService.isMyMessage.next(this.isMyMessage);
  }
}
