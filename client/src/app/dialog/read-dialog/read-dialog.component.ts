import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable, map } from "rxjs";
import { IMessage } from "src/app/shared/models/IMessage";
import { IOption } from "src/app/shared/models/IOption";
import { ChatService } from "src/app/shared/services/chat.service";
import { currentRoomSelector } from "src/app/store/chat/chat.selectors";
import { IUser } from "../../shared/models/IUser";


@Component({
  selector: "app-read-dialog",
  templateUrl: "./read-dialog.component.html",
  styleUrls: ["./read-dialog.component.scss"]
})
/*
* @description This dialog is used just to show who read the message
*/
export class ReadDialogComponent  {
  /*
  * @description This is the variable that generate list of who read the message
  */
  public menuItems: Observable<IOption[] | null> = this.store.select(currentRoomSelector()).pipe(
    map((value) => {
      const arr = value?.users.filter((user: IUser) => this.data.read.indexOf(user._id) !== -1).map((value: IUser) => {
        return ({
          id: "user",
          title: value.name,
          icon: value.avatar,
        }) as IOption;
      });
      console.log(arr ?? null);
      return arr ?? null;
    })
  );

  constructor(public dialogRef: MatDialogRef<ReadDialogComponent>,
              public chatService: ChatService,
              public store: Store,
              @Inject(MAT_DIALOG_DATA) public data: IMessage) { }

  public onCloseClick(){
    this.dialogRef.close();
  }

}
