import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContextMenuDirective } from "./directives/context-menu.directive";
import { SearchPipe } from "./pipes/search.pipe";
import { UpdateRoomsPipe } from "./pipes/update-rooms.pipe";
import { PremiumNicknamePipe } from "./pipes/premium-nickname.pipe";
import { CustomContextMenuComponent } from "./components/custom-context-menu/custom-context-menu.component";
import { MatIconModule } from "@angular/material/icon";
import { InputAreacalculationPipe } from "./pipes/input-areacalculation.pipe";
import { ScrollTrackDirective } from "./directives/scroll-track.directive";
import { MatDividerModule } from "@angular/material/divider";
import { InViewPortDirective } from "./directives/in-view-port.directive";
import { IsPersonalMessagePipePipe } from "./pipes/find-user-pipe.pipe";
import { IsCreatedByMePipe } from "./pipes/is-created-by-me.pipe";
import { PopUpComponent } from "./components/pop-up/pop-up.component";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [
    ContextMenuDirective,
    ScrollTrackDirective,
    SearchPipe,
    UpdateRoomsPipe,
    PremiumNicknamePipe,
    IsPersonalMessagePipePipe,
    InputAreacalculationPipe,
    CustomContextMenuComponent,
    InViewPortDirective,
    IsCreatedByMePipe,
    PopUpComponent,
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
    InputAreacalculationPipe,
    InViewPortDirective,
    IsPersonalMessagePipePipe,
    IsCreatedByMePipe,
  ],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class SharedModule {
}
