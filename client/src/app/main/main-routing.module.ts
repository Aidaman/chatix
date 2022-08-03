import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {RoomResolver} from "../resolvers/room.resolver";

const routes: Routes = [
  // {path: '', component: MainComponent, children: [
  //     {path: ':id', component: RoomComponent}
  //   ]},
  // {path: ':id', component: RoomComponent},
  {path: ':id', component: MainComponent, },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule{}
