import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[app-scroll-track]'
})
export class ScrollTrackDirective implements AfterViewInit {
  @Output() loadMessages = new EventEmitter<void>();
  private isEmitted: boolean = false;
  private scrollHeight: number = 0;

  constructor(private el: ElementRef) {
  }

  public ngAfterViewInit(): void {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }

  @HostListener('scroll', ['$event'])
  scrollIt() {
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
