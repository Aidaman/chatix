import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";
import {SignInComponent} from "./sign-in/sign-in.component";


const routes: Routes = [
    {path: '', redirectTo: '/chat/common', pathMatch: 'full'},
    {path: 'chat', loadChildren: () => import('./main/main.module').then(m => m.MainModule), canActivate: [AuthGuard]},
    {path: 'auth', component: SignInComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
