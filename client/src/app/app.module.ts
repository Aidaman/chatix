import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { TokenInterceptor } from "./shared/interceptors/token.interceptor";
import { SignInComponent } from "./sign-in/sign-in.component";
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatBadgeModule } from "@angular/material/badge";
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatMenuModule } from "@angular/material/menu";
import { CustomContextMenuComponent } from "./shared/components/custom-context-menu/custom-context-menu.component";
import { SharedModule } from "./shared/shared.module";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { userReducer } from "./store/user/user.reducer";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { UserEffect } from "./store/user/user.effect";
import { roomChatReducer } from "./store/room-chat/room-chat.reducer";
import { RoomChatEffect } from "./store/room-chat/room-chat.effect";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatCardModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatMenuModule,
    SharedModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,

    StoreModule.forRoot({ user: userReducer, room: roomChatReducer }),
    StoreDevtoolsModule.instrument({}),
    EffectsModule.forRoot([UserEffect, RoomChatEffect])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
    { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
  ],
  exports: [
    CustomContextMenuComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
