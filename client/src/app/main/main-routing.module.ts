import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";

const routes: Routes = [
  /*
  * @description The route defines in which room user are
  * @description When route (id) changes so changes the room and messages in it as well
  */
  { path: ":id", component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class MainRoutingModule {
}
