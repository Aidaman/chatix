import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import {IUser} from "../models/IUser";
import {Params, Router} from "@angular/router";
import {SocketService} from "./socket.service";
import {Store} from "@ngrx/store";
import {userAuthAction} from "../../store/user/user.actions";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router,
              private store: Store,
              private socketService: SocketService,
              private localStorageService: LocalStorageService,) {
  }

  public user: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);

  public isAuthenticated(): boolean {
    const token = this.localStorageService.getToken();
    return token ? !!token : false;
  }

  public authenticate(params: Params): void {
    if (params['token']){
      const user = params as IUser
      this.localStorageService.setUser(JSON.stringify(user));
      this.socketService.connect();
      this.store.dispatch(userAuthAction())
      this.router.navigate(['/chat', user.id]);
    }
  }
}
