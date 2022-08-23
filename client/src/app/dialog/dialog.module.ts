import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogAddingRoomComponent } from "./new-room-dialog/dialog-adding-room.component";
import { DialogInvitationComponent } from "./invitation-dialog/dialog-invitation.component";
import { DialogInvitingRoomComponent } from "./invite-to-room-dialog/dialog-inviting-room.component";
import { DialogRoomSettingsComponent } from "./room-configuration-dialog/dialog-room-settings.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatListModule } from "@angular/material/list";
import { SharedModule } from "../shared/shared.module";
import { RoomSelectDialogComponent } from "./room-select-dialog/room-select-dialog.component";
import { ReadDialogComponent } from './read-dialog/read-dialog.component';

/*
* @description This is the module that wraps all the modal-window components
*/
@NgModule({
  declarations: [
    DialogAddingRoomComponent,
    DialogInvitationComponent,
    DialogInvitingRoomComponent,
    DialogRoomSettingsComponent,
    RoomSelectDialogComponent,
    ReadDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatListModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [
    DialogAddingRoomComponent,
    DialogInvitationComponent,
    DialogInvitingRoomComponent,
    DialogRoomSettingsComponent,
    RoomSelectDialogComponent,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useClass: DialogAddingRoomComponent,
    },
    {
      provide: MatDialogRef,
      useClass: DialogRoomSettingsComponent,
    },
  ]
})
export class DialogModule {
}
