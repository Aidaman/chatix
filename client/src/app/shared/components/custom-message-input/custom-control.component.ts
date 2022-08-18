import { Component, OnDestroy } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RoomService } from "../../services/room.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-custom-message-input",
  templateUrl: "./custom-control.component.html",
  styleUrls: ["./custom-control.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomMessageInputComponent,
      multi: true,
    }
  ]
})
export class CustomMessageInputComponent implements ControlValueAccessor, OnDestroy {
  val: any = "";
  disabled: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  private emojiSubscription: Subscription = this.roomService.emoji
    .asObservable()
    .subscribe((emoji) => {
      if (!this.val)
        this.value = emoji;

      else this.value = this.val + emoji; 
    });

  constructor(private roomService: RoomService) {
  }

  ngOnDestroy(): void {
    this.emojiSubscription.unsubscribe();
  }

  set value(value: string) {
    if (value === undefined) return;
    this.val = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(obj: string): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
