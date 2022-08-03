import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainComponent} from "./main.component";
import {RoomComponent} from "./room/room.component";
import {RoomListComponent} from "./room/room-list/room-list.component";
import {MessageItemComponent} from "./room/message-item/message-item.component";
import {EmojisComponent} from "./emojis/emojis.component";
import {ChatComponent} from "./chat/chat.component";
import {ThemingComponent} from "./room/room-list/theming/theming.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {HeaderComponent} from "./header/header.component";
import {DialogModule} from "../dialog/dialog.module";
import {MainRoutingModule} from "./main-routing.module";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {MatBadgeModule} from "@angular/material/badge";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    MainComponent,
    RoomComponent,
    RoomListComponent,
    MessageItemComponent,
    EmojisComponent,
    ChatComponent,
    ThemingComponent,
    HeaderComponent
  ],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatIconModule,
        MatSlideToggleModule,
        MatListModule,
        MatButtonModule,
        MatRippleModule,
        MatInputModule,
        FormsModule,
        DialogModule,
        SharedModule,
        PerfectScrollbarModule,

        MainRoutingModule,
        MatBadgeModule,
    ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class MainModule { }
