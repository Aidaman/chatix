import { Injectable } from "@angular/core";
import { DialogInvitationComponent } from "../../dialog/invitation-dialog/dialog-invitation.component";
import { lastValueFrom, tap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { SocketService } from "./socket.service";
import { IRoom } from "../models/IRoom";
import { DialogRoomSettingsComponent } from "../../dialog/room-configuration-dialog/dialog-room-settings.component";
import { IUser } from "../models/IUser";
import { DialogInvitingRoomComponent } from "../../dialog/invite-to-room-dialog/dialog-inviting-room.component";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ModalsService {

  constructor(private socketService: SocketService,
              private router: Router,
              public dialog: MatDialog) { }

  /*
  * @description the function that opens modal window for invitation to the room
  */
  public async openInvitation(data: any): Promise<void> {
    const invitationDialogRef = this.dialog.open(DialogInvitationComponent,
      { hasBackdrop: true, data });

    const invitationResultSource$ = invitationDialogRef.afterClosed().pipe(tap((response) => {
      if (response) {
        if (response.isAgree)
          this.socketService.emit("acceptInvitation", { roomId: response.roomId });
        else
          this.socketService.emit("leaveRoom", { roomId: response.roomId });
      }
    }));

    await lastValueFrom(invitationResultSource$);
  }

  /*
  * @description Opens modal window for configure room
  */
  public async openSettings(room: IRoom): Promise<void> {
    const matDialogRef = this.dialog.open(DialogRoomSettingsComponent, { data: room });
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      //If Value is false - then no changes were made
      if (!value) return;
      if (value.delete) {
        this.socketService.emit("roomDelete", { roomId: value.roomId });
        this.router.navigate(["chat", "common"]);
      } else {
        if (value.newRoomTitle !== room.title)
          this.socketService.emit("renameRoom", { roomId: value._id, roomTitle: value.newRoomTitle });

        if (value.newIsPublic !== room.isPublic)
          this.socketService.emit("privacyChange", { roomId: value._id, roomPublicity: value.newIsPublic });

        if (value.deletedUsers && value.deletedUsers.length > 0) {
          value.deletedUsers.forEach((user: IUser) => {
            this.socketService.emit("deleteParticipant", { roomId: room._id, deletedUserId: user._id });
          });
        }
      }
    }));

    await lastValueFrom(afterClosedSource$);
  }

  /*
  * @description opens modal window for invite users into room
  */
  public async openInviteParticipantsDialog(room: IRoom): Promise<void> {
    const matDialogRef = this.dialog.open(DialogInvitingRoomComponent,
      { data: room });
    const afterClosedSource$ = matDialogRef.afterClosed().pipe(tap((value) => {
      if (!value) return;
      else this.socketService.emit("inviteUsers", { roomId: value.roomId, participants: value.participants });
    }));

    await lastValueFrom(afterClosedSource$);
  }
}
