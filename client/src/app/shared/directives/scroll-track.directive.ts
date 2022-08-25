import {
  AfterViewInit,  Directive,  ElementRef,  EventEmitter,
  HostListener,   OnDestroy,   OnInit,  Output
} from "@angular/core";
import { Subject, takeUntil, tap } from "rxjs";
import { LocalStorageService } from "../services/local-storage.service";
import { ScrollService } from "../services/scroll.service";
import { environment } from "../../../environments/environment";
import {MessagesService} from "../services/messages.service";

/*
* @description This is a directive to track the scroll in the room
* @description It fires an event to load new messages when the scroll is at the right position
*/
@Directive({
  selector: "[app-scroll-track]"
})
export class ScrollTrackDirective implements OnInit, AfterViewInit, OnDestroy{
  @Output() loadMessages = new EventEmitter<void>();
  private terminate$: Subject<boolean> = new Subject<boolean>();
  private scrollHeight: number = 0;
  private scrollTop: number = 0;
  private isEmitted: boolean = false;
  private isQueryDone: boolean = false;

  constructor(private el: ElementRef,
              private scrollService: ScrollService,
              private messageService: MessagesService,
              private localStorageService: LocalStorageService,) {}

  public ngOnInit(): void {
    this.scrollService.scrollDown$.pipe(
      tap((isForceScroll: boolean) => {
        if (isForceScroll && this.messageService.messageSent.getValue()) {
          this.messageService.messageSent.next(false);
          this.setScroll(null);
        }
      }),
      takeUntil(this.terminate$),
    ).subscribe();

    this.scrollService.roomSwitched.pipe(
      tap(({ roomId }) => {
        if (environment.ENABLE_EXPERIMENTAL_FUNCTIONALITY){
          if (roomId === "common") return;
          //save scroll position for previous room
          if (this.el.nativeElement.scrollTop > 500)
            this.localStorageService.setScrollPosition(this.scrollService.previousRoomId.value, this.scrollHeight - this.el.nativeElement.scrollTop);

          //get scroll for current room
          const scroll: number = +this.localStorageService.getScrollPosition(roomId);
          console.log(scroll);

          //set scroll for current room
          if (scroll && scroll > 500)
            this.setScroll(scroll);
          else this.setScroll(null);
        } else {
          this.setScroll(null);
        }
      }),
      takeUntil(this.terminate$),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.setScroll(null);
  }

  ngOnDestroy(): void {
    this.terminate$.next(true);
    this.terminate$.complete();
  }

  private emit(eventScrollTop: number){
    this.scrollTop = eventScrollTop;
    if (eventScrollTop < 500 && !this.isEmitted) {
      this.scrollHeight = this.el.nativeElement.scrollHeight;
      this.loadMessages.emit();

      this.isQueryDone = false;
      this.isEmitted = true;
    }
    if (this.scrollHeight !== this.el.nativeElement.scrollHeight) {
      this.isEmitted = false;
      this.isQueryDone = true;
    }
  }

  @HostListener("scroll", ["$event"])
  public scrollIt() {
    //@ts-ignore
    this.emit(event?.target.scrollTop);
  }

  public setScroll(newScrollPosition: number | null): void{
    if (!newScrollPosition) this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    else this.el.nativeElement.scrollTop = newScrollPosition;
  }
}
