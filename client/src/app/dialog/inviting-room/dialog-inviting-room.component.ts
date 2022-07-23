import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";
import {IRoom} from "../../shared/models/IRoom";
import {IUser} from "../../shared/models/IUser";

@Component({
  selector: 'app-inviting-room-chat',
  templateUrl: './dialog-inviting-room.component.html',
  styleUrls: ['./dialog-inviting-room.component.scss'],
})
export class DialogInvitingRoomComponent implements OnInit {
  public addUsersForm: UntypedFormGroup = this.fb.group({
    participants: this.fb.array([this.fb.group({
      name: ['', [Validators.required]]
    })])
  });
  public selectedInput: number | null = 0;
  public searchedUsers: any[] = [];
  public userIds: any = [false];
  public theme: string = 'dark';

  constructor(public dialogRef: MatDialogRef<DialogInvitingRoomComponent>,
              private fb: UntypedFormBuilder,
              private socketService: SocketService,
              @Inject(MAT_DIALOG_DATA) public data: IRoom,
              private chatService: ChatService) {
  }

  public ngOnInit(): void {
    // this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
    this.onSearch();
    // this.socketService.listen('searchResult').subscribe(users => {
    //   if (users.length === 1 &&
    //     this.selectedInput !== null &&
    //     this.addUsersForm.get('participants')?.value[this.selectedInput].name === users[0].name) {
    //     let flag = false;
    //     for (let roomUser of this.data.users) {
    //       if (users[0]._id !== roomUser._id) {
    //         flag = true;
    //       } else {
    //         flag = false;
    //         break;
    //       }
    //     }
    //     if (flag) {
    //       this.userIds[this.selectedInput] = users[0]._id;
    //     } else {
    //       this.userIds[this.selectedInput] = false;
    //     }
    //   } else {
    //     this.searchedUsers = users.filter((user: User) => {
    //       let flag = false;
    //       for (let roomUser of this.data.users) {
    //         if (user._id !== roomUser._id) {
    //           flag = true;
    //         } else {
    //           flag = false;
    //           break;
    //         }
    //       }
    //       return flag;
    //     });
    //     if (this.selectedInput !== null)
    //       this.userIds[this.selectedInput] = false;
    //   }
    // });
  }

  public get participants(): UntypedFormArray {
    return this.addUsersForm.get('participants') as UntypedFormArray;
  }

  public addParticipant(): void {
    this.participants.push(this.fb.group({
      name: ['', [Validators.required]]
    }));
    this.userIds.push(false);
  }

  public deleteParticipant(index: number): void {
    this.selectedInput = null;
    this.participants.removeAt(index);
    this.userIds.splice(index, 1);
  }

  public onNoClick(): void {
    this.dialogRef.close(false);
  }

  public onInvite(): void {
    this.userIds = this.userIds.filter((userId: string) => {
      let flag = false;
      for (let roomUser of this.data.users) {
        if (userId !== roomUser.id) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }
      if (!userId) flag = false;
      return flag;
    });
    this.userIds = Array.from(new Set(this.userIds));
    this.dialogRef.close({roomId: this.data._id, participants: this.userIds,});
  }

  public onSearch(): void {
    this.addUsersForm.valueChanges.subscribe(changes => {
      if (this.selectedInput !== null) {
        if (changes.participants[this.selectedInput].name.length > 2) {
          // this.socketService.emit('searchUsers', changes.participants[this.selectedInput].name);
        }
      }
    });
  }

  public pushId(userId: string): void {
    if (this.selectedInput !== null)
      this.userIds[this.selectedInput] = userId;
  }

  public validateInputs(): boolean {
    this.userIds = this.userIds.filter((userId: string) => {
      let flag = false;
      for (let roomUser of this.data.users) {
        if (userId !== roomUser.id) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }
      return flag;
    });
    return this.userIds.every((item: string) => !!item);
  }
}
