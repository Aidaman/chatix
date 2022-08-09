import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { ChatService } from "../../services/chat.service";
import { IOption } from "../../models/IOption";
import { BehaviorSubject } from "rxjs";
// import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-custom-context-menu",
  templateUrl: "./custom-context-menu.component.html",
  styleUrls: ["./custom-context-menu.component.scss"],
})
export class CustomContextMenuComponent implements OnInit{
  @Output() optionSelect: EventEmitter<string> = new EventEmitter<string>();
  @Input() options: IOption[] | null = [];

  public isShown: BehaviorSubject<boolean> = this.chatService.isMyMessage;
  // public contextMenuConfig: BehaviorSubject<{ left: number, top: number }> = this.chatService.contextMenuConfig;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    if (!this.chatService.isMyMessage.value)
      this.options = [{ id: "none", title: "you can not interact with other's message", icon: "error" }];
  }

  @HostListener("document:click", ["$event"])
  clickedOutside(): void {
    this.chatService.showContextMenu.next(false);
  }

  public selectOption(optionId: string): void {
    this.optionSelect.emit(optionId);
  }

}
