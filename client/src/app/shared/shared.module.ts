import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContextMenuDirective} from "./directives/context-menu.directive";
import {SearchPipe} from "./pipes/search.pipe";
import {UpdateRoomsPipe} from "./pipes/update-rooms.pipe";
import {PremiumNicknamePipe} from './pipes/premium-nickname.pipe';
import {CustomContextMenuComponent} from "./components/custom-context-menu/custom-context-menu.component";
import {MatIconModule} from "@angular/material/icon";
import { InputAreacalculationPipe } from './pipes/input-areacalculation.pipe';
import { ScrollTrackDirective } from './directives/scroll-track.directive';
import {MatDividerModule} from "@angular/material/divider";
import { InViewPortDirective } from './directives/in-view-port.directive';

@NgModule({
  declarations: [
    ContextMenuDirective,
    ScrollTrackDirective,
    SearchPipe,
    UpdateRoomsPipe,
    PremiumNicknamePipe,
    CustomContextMenuComponent,
    InputAreacalculationPipe,
    InViewPortDirective,
  ],
    imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule
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
  ],
  providers: [
    { provide: Window, useValue: window }
  ]
})
export class SharedModule {
}
