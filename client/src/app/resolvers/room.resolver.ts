import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import {filter, Observable, of, switchMap} from 'rxjs';
import {Store} from "@ngrx/store";
import {isAllRoomsHasValue, messagesSelector, roomByIdSelect} from "../store/room-chat/room-chat.selectors";
import {
  chatGetAvailableRooms,
  roomGetAmountOfMessagesAction, roomGetMessagesAction,
  roomSwitchAction
} from "../store/room-chat/room-chat.actions";
import {MainRoutingModule} from "../main/main-routing.module";
import {MainModule} from "../main/main.module";

@Injectable({
  providedIn: "root"
})
export class RoomResolver implements Resolve<boolean> {
  constructor(private store: Store){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log("resolver activated");

    const id = route.params["id"];

    this.store.select(isAllRoomsHasValue).pipe(
      switchMap((value) => {
        if (!value) {
          this.store.dispatch(chatGetAvailableRooms());
          this.store.dispatch(roomSwitchAction({roomId: id}))
        }
        this.store.dispatch(roomSwitchAction({roomId: id}));
        this.store.dispatch(roomGetMessagesAction({roomId: id}));
        return this.store.select(roomByIdSelect(id));
      }),
      filter(Boolean),
    );

    this.store.select(isAllRoomsHasValue).pipe(
      switchMap((value) => {
        if (!value) {
          this.store.dispatch(chatGetAvailableRooms());
        }
        this.store.dispatch(roomGetAmountOfMessagesAction({roomId: id}));
        return this.store.select(messagesSelector);
      })
    )

    return of(true);
  }
}
