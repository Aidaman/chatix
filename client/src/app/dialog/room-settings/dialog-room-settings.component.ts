import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IRoom} from "../../shared/models/IRoom";
import {IUser} from "../../shared/models/IUser";

@Component({
  selector: 'app-room-chat-settings',
  templateUrl: './dialog-room-settings.component.html',
  styleUrls: ['./dialog-room-settings.component.scss'],
})
export class DialogRoomSettingsComponent implements OnInit {
  private me: string = this.localStorageService.getUser()['id'] as string;

  public participants: IUser[] = this.room.users.filter(user => user._id !== this.me);
  public removedUserIds: string[] = [];
  public delete: boolean = false;
  public theme: string = 'dark';

  constructor(public dialogRef: MatDialogRef<DialogRoomSettingsComponent>,
              private localStorageService: LocalStorageService,
              @Inject(MAT_DIALOG_DATA) public room: IRoom) {
  }

  public ngOnInit(): void {
    console.log('DialogRoomSettingsComponent', this.room);
    // this.room.users = this.room.users.filter(user => user.id !== this.me);
  }

  public onUpdate(): void {
    // this.room-chat.title = this.title.nativeElement.innerText;
    this.dialogRef.close({...this.room, deletedUsers: this.removedUserIds});
  }

  public onDelete(): void {
    this.dialogRef.close({
      roomId: this.room._id,
      delete: true
    });
  }

  public deleteParticipant(id: string): void {
    this.removedUserIds.push(id);
    this.room.users = this.room.users.filter(user => user.id !== id);
  }

  public deleteConfirm(): void {
    this.delete = !this.delete;
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }

  public switchPrivate(): void {
    this.room.isPublic = !this.room.isPublic;
  }
}
