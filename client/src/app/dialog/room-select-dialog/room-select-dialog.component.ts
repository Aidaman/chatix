import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IMessage } from 'src/app/shared/models/IMessage';
import { IRoom } from 'src/app/shared/models/IRoom';
import { SocketService } from 'src/app/shared/services/socket.service';
import { chatGetAvailableRooms } from 'src/app/store/room/room-chat.actions';
import { allRoomsSelector, isAllRoomsHasValue } from 'src/app/store/room/room-chat.selectors';
import { DialogRoomSettingsComponent } from '../room-configuration-dialog/dialog-room-settings.component';

/*
* @description This component describes modal window for select a room where message will be forwarded
*/
@Component({
  selector: 'app-room-select-dialog',
  templateUrl: './room-select-dialog.component.html',
  styleUrls: ['./room-select-dialog.component.scss', "../common-dialog-styles.scss"]
})
export class RoomSelectDialogComponent implements OnInit {
  public rooms$: Observable<IRoom[]> = this.store.select(isAllRoomsHasValue).pipe(
    switchMap((value) => {
      if (!value) {
        this.store.dispatch(chatGetAvailableRooms());
      }
      return this.store.select(allRoomsSelector);
    }),
  );
  
  public searchText: string = "";
  public isPublicRooms: boolean = false;
  public searchCondition: string = "public";

  constructor(public dialogRef: MatDialogRef<DialogRoomSettingsComponent>,
              private store: Store,
              private router: Router,
              private socketService: SocketService,
              @Inject(MAT_DIALOG_DATA) public data: IMessage) { }

  ngOnInit(): void {
  }

  public toggleSearch(){
    this.searchCondition = this.searchCondition.toLowerCase() === "public" ? "private" : "public";
  }

  public forwardTo(roomId: string){
    this.socketService.emit("forwardMessage", { messageId: this.data._id, room: roomId, content: this.data.content});
    this.router.navigate(["/chat", roomId]);
    this.dialogRef.close();
  }
}