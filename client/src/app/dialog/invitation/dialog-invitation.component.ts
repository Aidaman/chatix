import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChatService} from "../../shared/services/chat.service";
import {IRoom} from "../../shared/models/IRoom";

@Component({
  selector: 'app-invitation',
  templateUrl: './dialog-invitation.component.html',
  styleUrls: ['./dialog-invitation.component.scss'],
})
export class DialogInvitationComponent implements OnInit {
  public theme: string = 'dark';

  constructor(public dialogRef: MatDialogRef<DialogInvitationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IRoom,
              private chatService: ChatService) {
  }

  public ngOnInit(): void {
    // this.chatService.theme.subscribe(selectedTheme => {
    //     this.theme = selectedTheme;
    // });
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
