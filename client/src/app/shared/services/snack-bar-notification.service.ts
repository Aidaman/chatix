import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackBarNotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, actions: string[], config: any) {
    this._snackBar.open( message, actions[0], config);
  }
}
