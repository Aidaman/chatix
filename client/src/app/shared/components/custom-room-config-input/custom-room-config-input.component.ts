import { Component, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-custom-room-config-input",
  templateUrl: "./custom-room-config-input.component.html",
  styleUrls: ["./custom-room-config-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomRoomConfigInputComponent,
      multi: true,
    }
  ]
})
export class CustomRoomConfigInputComponent implements ControlValueAccessor {
  @Input() isContentEditable: boolean = false;
  @Input() title: any = "";

  val: any = this.title;
  disabled: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  // private emojiSubscription: Subscription = this.roomService.emoji
  // .asObservable()
  // .subscribe((value) => {
  //   if (!this.val)
  //       this.value = value;

  //   else this.value = this.val + value;
  // });

  // constructor(private roomService: RoomService) {
  // }

  // ngOnDestroy(): void {
  //   this.emojiSubscription.unsubscribe();
  // }

  set value(value: string) {
    if (value && value.length > 0 && value.length < 21){
      this.val = value.slice(0, 20);
      this.onChange(value);
      this.onTouched();
    } else return;
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
