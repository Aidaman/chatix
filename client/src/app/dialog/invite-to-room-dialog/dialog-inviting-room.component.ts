import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IRoom } from "../../shared/models/IRoom";
import { debounceTime, lastValueFrom, map, Subscription } from "rxjs";
import { SocketService } from "../../shared/services/socket.service";
import { IUser } from "../../shared/models/IUser";
import { ChatService } from "../../shared/services/chat.service";
import { SignalRService } from "../../shared/services/signal-r.service";

/*
* @description This component describes modal window for invite users to room
*/
@Component({
  selector: "app-invite-to-room",
  templateUrl: "./dialog-inviting-room.component.html",
  styleUrls: ["./dialog-inviting-room.component.scss", "../common-dialog-styles.scss"],
})
export class DialogInvitingRoomComponent implements OnInit, OnDestroy {

  public addUsersForm: UntypedFormGroup = this.fb.group({
    participants: this.fb.array([this.fb.group({
      name: ["", [Validators.required]]
    })])
  });
  public selectedInput: number | null = 0;

  public room: IRoom = this.data;
  public searchedUsers: IUser[] | null = [];
  public userIds: any = [false];
  public theme: string = "dark";

  constructor(public dialogRef: MatDialogRef<DialogInvitingRoomComponent>,
              private fb: UntypedFormBuilder,
              private chatService: ChatService,
              private socketService: SocketService,
              private signalRService: SignalRService,
              @Inject(MAT_DIALOG_DATA) public data: IRoom) {
  }

  public async ngOnInit() {
    await this.onSearch();
    // this.listenSearch();
  }

  public async ngOnDestroy() {
    (await this.onSearch()).unsubscribe();
  }

  public get participants(): UntypedFormArray {
    return this.addUsersForm.get("participants") as UntypedFormArray;
  }

  public addParticipant(): void {
    this.participants.push(this.fb.group({ name: ["", [Validators.required]] }));
    this.userIds.push(null);
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
    this.userIds = this.userIds.filter((userId: string) =>
      (userId !== this.chatService.getMe())
      || !(this.data.users.find((user: IUser) =>
        user._id === userId)));
    this.userIds = Array.from(new Set(this.userIds));
    this.dialogRef.close({ roomId: this.data._id, participants: this.userIds, });
  }

  public async onSearch(): Promise<Subscription> {
    return this.addUsersForm.valueChanges
      .pipe(debounceTime((300)))
      .subscribe(async (changes) => {
        if (this.selectedInput !== null) {
          const name = changes.participants[this.selectedInput].name;
          await lastValueFrom(this.chatService.getUsersByName(name.length > 0 ? changes.participants[this.selectedInput].name : "*")
            .pipe(map((users) => {
              console.log(users);
              if (this.selectedInput !== null
                && users !== null
                && users.length === 1
                && this.addUsersForm.get("participants")?.value[this.selectedInput].name === users[0].name) {
                this.userIds[this.selectedInput] = users[0]._id;
              } else {
                this.searchedUsers = users?.filter((user: any) => user._id !== this.chatService.getMe());
                if (this.selectedInput !== null)
                  this.userIds[this.selectedInput] = false;
              }
              return this.searchedUsers;
            })));
        }
      });
  }

  //Searching users that can be invited
  // public onSearch(): Subscription {
  //   return this.addUsersForm.valueChanges
  //     .pipe(debounceTime((300)))
  //     .subscribe((changes) => {
  //       if (this.selectedInput !== null) {
  //         this.signalRService.invokeUserEvent("SearchUsers", JSON.stringify({
  //           name: changes.participants[this.selectedInput].name,
  //         }));
  //       }
  //     });
  // }

  public pushId(userId: string): void {
    if (this.selectedInput !== null)
      this.userIds[this.selectedInput] = userId;
  }

  public validateInputs(): boolean {
    this.userIds = this.userIds.filter((userId: string) =>
      (userId !== this.chatService.getMe())
      || !(this.data.users.find((user: IUser) =>
        user._id === userId)));

    return this.userIds.every((item: string) => !!item) && this.userIds.length > 0;
  }
}
