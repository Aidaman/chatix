import { Component } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { Router } from "@angular/router";
import { IUser } from "../../shared/models/IUser";
import { ThemingService } from "../../shared/services/theming.service";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";
import { hasUserValueSelector, userSelector } from "../../store/user/user.selectors";
import { Store } from "@ngrx/store";
import { userLogoutAction } from "../../store/user/user.actions";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"]
})
export class HeaderComponent{
    public user: Observable<IUser | null> = this.store.select(hasUserValueSelector).pipe(
      switchMap((value: boolean) => {
        if (!value){
          return of(null);
        }
        return this.store.select(userSelector);
      })
    );
    public theme: BehaviorSubject<string> = this.themingService.theme;

    constructor(private authService: AuthService,
                private store: Store,
                private router: Router,
                private localStorageService: LocalStorageService,
                private themingService: ThemingService) {}

    public logOut(): void {
        this.localStorageService.logout();
        this.store.dispatch(userLogoutAction());
        this.router.navigate(["/auth"]);
    }
}
