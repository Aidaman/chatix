import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy, OnInit,
  Output
} from "@angular/core";

/*
* @description this is an old directive to track weather the element is in the viewport,
* @description documentation for this are here: https://www.npmjs.com/package/@thisissoon/angular-inviewport
*/
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[snInViewport]",
})
export class InViewPortDirective implements OnInit, AfterViewInit, OnDestroy{
  private inViewport!: boolean;
  private readonly hasIntersectionObserver!: boolean;
  @Input() inViewportOptions!: IntersectionObserverInit;
  @Output() inViewportChange = new EventEmitter<boolean>();
  public observer!: IntersectionObserver;

  @HostBinding("class.sn-viewport--in")
  get isInViewport(): boolean {
    return this.inViewport;
  }

  @HostBinding("class.sn-viewport--out")
  get isNotInViewport(): boolean {
    return !this.inViewport;
  }

  constructor(private el: ElementRef, private window: Window) {
    this.hasIntersectionObserver = this.intersectionObserverFeatureDetection();
  }

  ngOnInit() {
    if (!this.hasIntersectionObserver) {
      this.inViewport = true;
      this.inViewportChange.emit(this.inViewport);
    }
  }

  ngAfterViewInit() {
    if (this.hasIntersectionObserver) {
      // @ts-ignore
      const IntersectionObserver = this.window["IntersectionObserver"];
      this.observer = new IntersectionObserver(
        this.intersectionObserverCallback.bind(this),
        this.inViewportOptions
      );

      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.el.nativeElement);
    }
  }

  intersectionObserverCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (this.inViewport === entry.isIntersecting) return;
      this.inViewport = entry.isIntersecting;
      this.inViewportChange.emit(this.inViewport);
    });
  }

  private intersectionObserverFeatureDetection() {
    // Exits early if all IntersectionObserver and IntersectionObserverEntry
    // features are natively supported.
    if (
      "IntersectionObserver" in this.window &&
      "IntersectionObserverEntry" in this.window
    ) {
      // Minimal polyfill for Edge 15's lack of `isIntersecting`
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      if (
        !(
          "isIntersecting" in
          // @ts-ignore
          this.window["IntersectionObserverEntry"]["prototype"]
        )
      ) {
        Object.defineProperty(
          // @ts-ignore
          this.window["IntersectionObserverEntry"]["prototype"],
          "isIntersecting",
          {
            get: function () {
              return this.intersectionRatio > 0;
            },
          }
        );
      }
      return true;
    }
    return false;
  }
}
