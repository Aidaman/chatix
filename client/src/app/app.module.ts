import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatToolbarModule} from "@angular/material/toolbar";
import {ContactListComponent} from './dialog/contact-list/contact-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {TokenInterceptor} from "./shared/interceptors/token.interceptor";
import {SignInComponent} from './sign-in/sign-in.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {DialogAddingRoomComponent} from './dialog/adding-room/dialog-adding-room.component';
import {DialogInvitationComponent} from './dialog/invitation/dialog-invitation.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DialogInvitingRoomComponent} from './dialog/inviting-room/dialog-inviting-room.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DialogRoomSettingsComponent} from './dialog/room-settings/dialog-room-settings.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatBadgeModule} from "@angular/material/badge";
import {MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatMenuModule} from "@angular/material/menu";
import {CustomContextMenuComponent} from "./shared/components/custom-context-menu/custom-context-menu.component";
import {SharedModule} from "./shared/shared.module";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {userReducer} from "./store/user/user.reducer";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {EffectsModule} from "@ngrx/effects";
import {UserEffect} from "./store/user/user.effect";
import {roomChatReducer} from "./store/room-chat/room-chat.reducer";
import {RoomChatEffect} from "./store/room-chat/room-chat.effect";

@NgModule({
    declarations: [
        AppComponent,
        ContactListComponent,
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
        StoreModule.forRoot({}),
        StoreModule.forFeature('user', userReducer),
        StoreModule.forFeature('room and chat', roomChatReducer),
        StoreDevtoolsModule.instrument({}),
        EffectsModule.forRoot([UserEffect, RoomChatEffect])
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: TokenInterceptor
        },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } }
    ],
    exports: [
        CustomContextMenuComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
