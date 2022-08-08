import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PopUpComponent } from "../components/pop-up/pop-up.component";

@Injectable({
  providedIn: "root"
})
export class SnackBarNotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, actions: string[]) {
    // this._snackBar.openFromComponent( PopUpComponent,{
    //   horizontalPosition: "center",
    //   verticalPosition: "top",
    //   duration: 2000,
    //   data: { message, actions },
    // });
    this._snackBar.open( message, actions[0],{
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 2000,
    });
  }
}
