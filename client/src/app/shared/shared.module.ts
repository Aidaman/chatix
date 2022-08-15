import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContextMenuDirective } from "./directives/context-menu.directive";
import { SearchPipe } from "./pipes/search.pipe";
import { UpdateRoomsPipe } from "./pipes/update-rooms.pipe";
import { PremiumNicknamePipe } from "./pipes/premium-nickname.pipe";
import { CustomContextMenuComponent } from "./components/custom-context-menu/custom-context-menu.component";
import { MatIconModule } from "@angular/material/icon";
import { ScrollTrackDirective } from "./directives/scroll-track.directive";
import { MatDividerModule } from "@angular/material/divider";
import { InViewPortDirective } from "./directives/in-view-port.directive";
import { IsPersonalMessagePipePipe } from "./pipes/is-personal-messages.pipe";
import { IsCreatedByMePipe } from "./pipes/is-created-by-me.pipe";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { FilterListByPipe } from "./pipes/filter-list-by.pipe";
import { CustomMessageInputComponent } from "./components/custom-message-input/custom-control.component";
import { CustomRoomConfigInputComponent } from "./components/custom-room-config-input/custom-room-config-input.component";

@NgModule({
  declarations: [
    ContextMenuDirective,
    ScrollTrackDirective,
    SearchPipe,
    UpdateRoomsPipe,
    PremiumNicknamePipe,
    IsPersonalMessagePipePipe,
    CustomContextMenuComponent,
    InViewPortDirective,
    IsCreatedByMePipe,
    FilterListByPipe,
    CustomMessageInputComponent,
    CustomRoomConfigInputComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [
    ContextMenuDirective,
    ScrollTrackDirective,
    SearchPipe,
    UpdateRoomsPipe,
    PremiumNicknamePipe,
    CustomContextMenuComponent,
    InViewPortDirective,
    IsPersonalMessagePipePipe,
    IsCreatedByMePipe,
    FilterListByPipe,
    CustomMessageInputComponent,
    CustomRoomConfigInputComponent,
  ],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class SharedModule {
}
