import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener, Input,
  Output
} from "@angular/core";
import { SocketService } from "../services/socket.service";
import { map } from "rxjs";
import { ChatService } from "../services/chat.service";
import { IMessage } from "../models/IMessage";

@Directive({
  selector: "[app-scroll-track]"
})
export class ScrollTrackDirective implements AfterViewInit {
  @Output() loadMessages = new EventEmitter<void>();
  private isEmitted: boolean = false;
  private scrollHeight: number = 0;

  constructor(private el: ElementRef,) {
  }

  public ngAfterViewInit(): void {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }

  @HostListener("scroll", ["$event"])
  public scrollIt() {
    //@ts-ignore
    if (event?.srcElement.scrollTop < 500 && !this.isEmitted) {
      this.scrollHeight = this.el.nativeElement.scrollHeight;
      this.loadMessages.emit();
      this.isEmitted = true;
    }
    if (this.scrollHeight !== this.el.nativeElement.scrollHeight) {
      this.isEmitted = false;
    }
  }
}
