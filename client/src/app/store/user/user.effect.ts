import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import {
  userAuthAction,
  userAuthFailureAction,
  userAuthSuccessAction,
} from "./user.actions";
import { SocketService } from "../../shared/services/socket.service";
import { ChatService } from "../../shared/services/chat.service";

@Injectable()
export class UserEffect {
  userLogin$ = createEffect(() => this.actions$.pipe(
    ofType(userAuthAction),
    switchMap(() => {
      return of(this.localStorageService.getUser()).pipe(
        map((user) => userAuthSuccessAction({ user })),
        catchError(() => of(userAuthFailureAction))
      );
    })
  ));

  constructor(private store: Store,
              private actions$: Actions,
              private socketService: SocketService,
              private chatService: ChatService,
              private localStorageService: LocalStorageService) {
  }
}
