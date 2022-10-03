import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IRoom } from "../../shared/models/IRoom";
import { IUser } from "../../shared/models/IUser";
import { ThemingService } from "../../shared/services/theming.service";
import { BehaviorSubject } from "rxjs";
import { ChatService } from "../../shared/services/chat.service";
import { FormBuilder, Validators } from "@angular/forms";

/*
* @description This component describes modal window for configuring the room
*/
@Component({
  selector: "app-room-settings",
  templateUrl: "./dialog-room-settings.component.html",
  styleUrls: ["./dialog-room-settings.component.scss", "../common-dialog-styles.scss"],
})
export class DialogRoomSettingsComponent{
  public participants: IUser[] = this.room.users.filter(user => user._id !== this.me);
  public isRoomPublic: boolean = this.room.isPublic;
  public removedUsers: IUser[] = [];
  public delete: boolean = false;
  public isEdit: boolean = false;

  public dialogForm = this.fb.group({
    title: [this.room.title, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)]],
  });

  public me = this.chatService.getMe();

  constructor(public dialogRef: MatDialogRef<DialogRoomSettingsComponent>,
              public chatService: ChatService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public room: IRoom) {
  }

  public onUpdate(): void {
    // this.room.title = this.title.nativeElement.innerText;
    const title = this.dialogForm.get("title")?.value;
    this.dialogRef.close({
      ...this.room,
      newRoomTitle: title,
      newIsPublic: this.isRoomPublic,
      deletedUsers: this.removedUsers });
  }

  public onDelete(): void {
    this.dialogRef.close({
      roomId: this.room._id,
      delete: true,
      creatorId: this.room.creator?._id,
    });
  }

  public deleteParticipant(user: IUser): void {
    this.removedUsers.push(user);
    this.participants = this.participants.filter(val => val._id !== user._id);
  }

  public deleteConfirm(): void {
    this.delete = !this.delete;
  }

  public onNoClick(): void {
    console.log(this.room);
    this.dialogRef.close(false);
  }

  public switchPrivate(): void {
    if (this.room.isFavorites) return;
    else this.isRoomPublic = !this.isRoomPublic;
  }

  public toggleEdit(): void{
    this.isEdit = !this.isEdit;
  }
}
