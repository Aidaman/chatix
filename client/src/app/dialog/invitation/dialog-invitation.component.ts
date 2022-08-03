import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IRoom} from "../../shared/models/IRoom";
import {ThemingService} from "../../shared/services/theming.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-invitation',
  templateUrl: './dialog-invitation.component.html',
  styleUrls: ['./dialog-invitation.component.scss'],
})
export class DialogInvitationComponent {
  public theme: BehaviorSubject<string> = this.themingService.theme;

  constructor(public dialogRef: MatDialogRef<DialogInvitationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IRoom,
              private themingService: ThemingService) {
  }

  public onAgree(): void {
    this.dialogRef.close({
      isAgree: true,
      roomId: this.data._id
    });
  }

  public onDisagree(): void {
    this.dialogRef.close({
      isAgree: false,
      roomId: this.data._id
    });
  }

}
