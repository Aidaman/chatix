import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output
} from '@angular/core';

@Directive({
  selector: '[scroll]'
})
export class ScrollTrackDirective {
  @Output() onScroll = new EventEmitter<void>();
  private isEmitted: boolean = false;
  private scrollHeight: number = 0;

  constructor(private el: ElementRef) {
  }

  @HostListener('scroll', ['$event'])
  scrollIt() {
    //@ts-ignore
    if (event?.srcElement.scrollTop < 300 && !this.isEmitted) {
      this.scrollHeight = this.el.nativeElement.scrollHeight;
      this.onScroll.emit();
      this.isEmitted = true;
    }
    if(this.scrollHeight !== this.el.nativeElement.scrollHeight){
      this.isEmitted = false;
    }
  }

  public reset() {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }
}
