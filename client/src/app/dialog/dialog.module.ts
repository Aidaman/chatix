import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogAddingRoomComponent} from "./adding-room/dialog-adding-room.component";
import {DialogInvitationComponent} from "./invitation/dialog-invitation.component";
import {DialogInvitingRoomComponent} from "./inviting-room/dialog-inviting-room.component";
import {DialogRoomSettingsComponent} from "./room-settings/dialog-room-settings.component";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDividerModule} from "@angular/material/divider";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatRippleModule} from "@angular/material/core";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    DialogAddingRoomComponent,
    DialogInvitationComponent,
    DialogInvitingRoomComponent,
    DialogRoomSettingsComponent,
  ],
  imports: [
    CommonModule,
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
