import { Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SocketService } from "../../shared/services/socket.service";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { ThemingService } from "../../shared/services/theming.service";
import { BehaviorSubject, debounceTime, Subscription } from "rxjs";

/*
* @description This component represents modal window for creating new room
*/
@Component({
  selector: "app-new-room-dialog-chat",
  templateUrl: "./dialog-adding-room.component.html",
  styleUrls: ["./dialog-adding-room.component.scss", "../common-dialog-styles.scss"],
})
export class DialogAddingRoomComponent implements OnInit, OnDestroy {
  private me = this.localStorageService.getUser()["id"] as string;

  public newRoomForm: UntypedFormGroup = this.fb.group({
    title: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)]],
    participants: this.fb.array([this.fb.group({ name: ["", [Validators.required]] })])
  });
  public selectedInput: number | null = null;

  public searchedUsers: any;
  public userIds: any[] = [false];
  public isPublic = true;
  public theme: BehaviorSubject<string> = this.themingService.theme;

  constructor(public dialogRef: MatDialogRef<DialogAddingRoomComponent>,
              private fb: UntypedFormBuilder,
              private socketService: SocketService,
              private themingService: ThemingService,
              private localStorageService: LocalStorageService) {
  }

  public ngOnInit(): void {
    this.onSearch();
    this.listenSearch();
  }

  public ngOnDestroy() {
    this.onSearch().unsubscribe();
    this.listenSearch().unsubscribe();
  }

  public get participants(): UntypedFormArray {
    return this.newRoomForm.get("participants") as UntypedFormArray;
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

  public onCloseClick(): void {
    this.dialogRef.close(false);
  }

  //Submit of the form
  public onCreate(): void {
    this.userIds = this.userIds.filter(userId => userId !== this.me);
    this.userIds = Array.from(new Set(this.userIds));
    this.dialogRef.close({
      roomTitle: this.newRoomForm.get("title")?.value,
      participants: this.userIds,
      isPublic: this.isPublic
    });

  }

  //Searching users that can be invited
  public onSearch(): Subscription {
    return this.newRoomForm.valueChanges
      .pipe(debounceTime((300)))
      .subscribe((changes) => {
        if (this.selectedInput !== null) {
          this.socketService.emit("searchUsers", changes.participants[this.selectedInput].name);
        }
      });
  }

  public listenSearch(): Subscription{
    return this.socketService.listen("searchResult")
      .subscribe(users => {
        if (this.selectedInput !== null
          && users.length === 1
          && this.newRoomForm.get("participants")?.value[this.selectedInput].name === users[0].name) {
          this.userIds[this.selectedInput] = users[0]._id;
        } else {
          this.searchedUsers = users.filter((user: any) => user._id !== this.me);
          if (this.selectedInput !== null)
            this.userIds[this.selectedInput] = false;
        }
      });
  }

  public pushId(userId: string): void {
    if (this.selectedInput !== null)
      this.userIds[this.selectedInput] = userId;
  }

  public validateInputs(): boolean {
    this.userIds = this.userIds.filter(userId => userId !== this.me);
    return this.userIds.every(item => !!item) && this.userIds.length > 0;
  }

  public switchPrivate(): void {
    this.isPublic = !this.isPublic;
  }

}
