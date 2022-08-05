import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IRoom } from "../../shared/models/IRoom";
import { IUser } from "../../shared/models/IUser";
import { ThemingService } from "../../shared/services/theming.service";
import { BehaviorSubject } from "rxjs";
import { ChatService } from "../../shared/services/chat.service";

@Component({
  selector: "app-room-chat-settings",
  templateUrl: "./dialog-room-settings.component.html",
  styleUrls: ["./dialog-room-settings.component.scss"],
})
export class DialogRoomSettingsComponent{
  public participants: IUser[] = this.room.users.filter(user => user._id !== this.me);
  public isRoomPublic: boolean = this.room.isPublic;
  public newRoomTitle: string = this.room.title;
  public removedUsers: IUser[] = [];
  public delete: boolean = false;

  public me = this.chatService.me;
  public theme: BehaviorSubject<string> = this.themeService.theme;

  constructor(public dialogRef: MatDialogRef<DialogRoomSettingsComponent>,
              public chatService: ChatService,
              private themeService: ThemingService,
              @Inject(MAT_DIALOG_DATA) public room: IRoom) {
  }

  public onUpdate(): void {
    // this.room-chat.title = this.title.nativeElement.innerText;
    this.dialogRef.close({
      ...this.room,
      newRoomTitle: this.newRoomTitle,
      newIsPublic: this.isRoomPublic,
      deletedUsers: this.removedUsers });
  }

  public onDelete(): void {
    this.dialogRef.close({
      roomId: this.room._id,
      delete: true
    });
  }

  public deleteParticipant(user: IUser): void {
    this.removedUsers.push(user);
    this.participants = this.participants.filter(val => val.id !== user.id);
  }

  public deleteConfirm(): void {
    this.delete = !this.delete;
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }

  public switchPrivate(): void {
    this.isRoomPublic = !this.isRoomPublic;
  }
}
