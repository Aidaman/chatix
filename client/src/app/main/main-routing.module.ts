import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {RoomResolver} from "../resolvers/room.resolver";

const routes: Routes = [
  {path: ':id', component: MainComponent, resolve: {room: RoomResolver}},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class MainRoutingModule {
}
