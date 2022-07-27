import {
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener, OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Store} from "@ngrx/store";
import {SocketService} from "../services/socket.service";
import {roomGetMessagesAction} from "../../store/room-chat/room-chat.actions";
import {Observable, Subscription} from "rxjs";
import {totalMessagesSelector} from "../../store/room-chat/room-chat.selectors";

@Directive({
  selector: '[scroll]'
})
export class ScrollTrackDirective implements OnDestroy {
  public counter: number = 0;
  private totalMessagesSubscription: Subscription = this.store.select(totalMessagesSelector).subscribe((value) => {
    this.totalMessages = value;
  });
  private totalMessages: number = 50;

  constructor(private el: ElementRef,
              private socketService: SocketService,
              private store: Store) {
  }

  public ngOnDestroy() {
    this.totalMessagesSubscription.unsubscribe();
  }

  @HostListener('scroll', ['$event'])
  scrollIt() {
    //@ts-ignore
    const scroll = event?.srcElement.scrollTop;
    if (scroll < 200 && this.socketService.limit < this.totalMessages) {
      if (this.socketService.limit + 15 > this.totalMessages)
        this.socketService.limit = this.totalMessages;
      else this.socketService.limit += 15;

      const scrollHeight = this.el.nativeElement.scrollHeight;

      if (this.socketService.limit !== this.totalMessages)
        this.el.nativeElement.scrollTop = Math.round(scrollHeight / (this.socketService.limit / 5));

      this.store.dispatch(roomGetMessagesAction(
        {roomId: this.socketService.roomId, offset: 0,  limit: this.socketService.limit}));
    }
  }

  public reset() {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }
}
