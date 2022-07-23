import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ChatComponent} from "./chat/chat.component";
import {MainComponent} from "./main.component";
import {RoomComponent} from "./room/room.component";

const routes: Routes = [
  // {path: '', component: MainComponent, children: [
  //     {path: ':id', component: RoomComponent}
  //   ]},
  // {path: ':id', component: RoomComponent},
  {path: ':id', component: MainComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule{}
