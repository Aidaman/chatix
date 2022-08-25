import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  roomGetAmountOfMessagesAction,
  roomGetAmountOfMessagesFailureAction,
  roomGetAmountOfMessagesSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomLoadMessagesAction,
  roomLoadMessagesFailureAction,
  roomLoadMessagesSuccessAction,
} from "./room.actions";
import { map, of, switchMap, } from "rxjs";
import { ChatService } from "../../shared/services/chat.service";
import { catchError } from "rxjs/operators";
import { offsetSelector } from "./room.selectors";

@Injectable()
export class RoomEffect {
  /*
  * @description effect that updates total of the messages in the room
  */
  amountOfMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetAmountOfMessagesAction),
    switchMap(({ roomId }) => this.chatService.getRoomMessagesamount(roomId).pipe(
      map((amount) => roomGetAmountOfMessagesSuccessAction({ amount: +amount })),
      catchError(() => of(roomGetAmountOfMessagesFailureAction())),
    ))
  ));

  /*
  * @description effect that updates messages
  */
  roomMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetMessagesAction),
    switchMap(({ roomId }) => this.chatService.getRoomContent(roomId, 0, 50).pipe(
      map((messages) => roomGetMessagesSuccessAction({ messages })),
      catchError(() => of(roomGetMessagesFailureAction()))))
  ));

  /*
  * @description effect that load messages when the scroll changes
  */
  loadMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomLoadMessagesAction),
    switchMap(({ roomId }) => this.store.select(offsetSelector).pipe(
      switchMap((offset) => this.chatService.getRoomContent(roomId, offset, 50).pipe(
        map((messages) => roomLoadMessagesSuccessAction({ messages })),
        catchError(() => of(roomLoadMessagesFailureAction()))))
    )),
  ));

  constructor(private actions$: Actions,
              private chatService: ChatService,
              private store: Store) {
  }
}
