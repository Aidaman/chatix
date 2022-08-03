import {forwardRef, Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot, ActivatedRoute
} from '@angular/router';
import {combineLatest, filter, map, Observable, of, switchMap, take} from 'rxjs';
import {Store} from "@ngrx/store";
import {isAllRoomsHasValue, messagesSelector, roomByIdSelect} from "../store/room-chat/room-chat.selectors";
import {
  chatGetAvailableRooms,
  roomGetAmountOfMessagesAction, roomGetMessagesAction,
  roomSwitchAction
} from "../store/room-chat/room-chat.actions";
import {MainRoutingModule} from "../main/main-routing.module";
import {MainModule} from "../main/main.module";
import {IMessage} from "../shared/models/IMessage";
import {IRoom} from "../shared/models/IRoom";

@Injectable({
  providedIn: "root"
})
export class RoomResolver implements Resolve<{room: IRoom, messages: IMessage[] }> {
  constructor(private store: Store){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{room: IRoom, messages: IMessage[] }> {
    console.log("resolver activated");

    const room$ = this.store.select(isAllRoomsHasValue).pipe(
      switchMap((value) => {
        const id = route.params["id"];
        if (!value) {
          this.store.dispatch(chatGetAvailableRooms());
          // this.store.dispatch(roomSwitchAction({roomId: id}))
        }
        this.store.dispatch(roomSwitchAction({roomId: id}));
        this.store.dispatch(roomGetMessagesAction({roomId: id}));
        return this.store.select(roomByIdSelect(id));
      }),
      filter(Boolean),
    );

    const messages$ = this.store.select(isAllRoomsHasValue).pipe(
      switchMap((value) => {
        const id = route.params["id"];
        if (!value) {
          this.store.dispatch(chatGetAvailableRooms());
        }
        this.store.dispatch(roomGetAmountOfMessagesAction({roomId: id}));
        return this.store.select(messagesSelector);
      }),
      filter((messages)=>!!messages.length),
    );

    return combineLatest([room$, messages$]).pipe(
      map(([room, messages])=> ({room, messages})),
      take(1),
    );
  }
}
