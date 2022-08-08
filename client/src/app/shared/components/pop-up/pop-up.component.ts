import { Component, Inject, OnInit } from "@angular/core";
import { SnackBarNotificationService } from "../../services/snack-bar-notification.service";
import { MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
  selector: "app-pop-up",
  templateUrl: "./pop-up.component.html",
  styleUrls: ["./pop-up.component.scss"]
})
export class PopUpComponent{

  constructor(private snackBars: SnackBarNotificationService,
              @Inject(MAT_SNACK_BAR_DATA) public data: {message: string, options: string[]}) { }

}
