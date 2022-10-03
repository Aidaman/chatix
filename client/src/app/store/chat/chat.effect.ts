import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, of, switchMap, } from "rxjs";
import { ChatService } from "../../shared/services/chat.service";
import { catchError } from "rxjs/operators";
import {
  chatGetAvailableRooms,
  chatGetAvailableRoomsFailure,
  chatGetAvailableRoomsSuccess,
  chatSearchRoomsActions, chatSearchRoomsFailureActions, chatSearchRoomsSuccessActions
} from "./chat.actions";

@Injectable()
export class ChatEffect {
  /*
  * @description effect that updates total of the messages in the room
  */
  getAllRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatGetAvailableRooms),
    switchMap(({ isPublic }) => this.chatService.getAvailableRooms(isPublic).pipe(
      map((rooms) => {
        return chatGetAvailableRoomsSuccess({ rooms });
      }),
      catchError(() => of(chatGetAvailableRoomsFailure())),
    ))
  ));

  searchRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatSearchRoomsActions),
    switchMap(({ title }) => this.chatService.getRoomByTitle(title).pipe(
      map((rooms) => {
        return chatSearchRoomsSuccessActions({ rooms });
      }),
      catchError(() => of(chatSearchRoomsFailureActions())),
    ))
  ));

  constructor(private actions$: Actions,
              private chatService: ChatService,
              private store: Store) {
  }
}
