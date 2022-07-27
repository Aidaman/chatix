import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {
  chatGetAvailableRooms,
  chatGetAvailableRoomsFailure,
  chatGetAvailableRoomsSucces,
  roomGetAmountOfMessagesAction,
  roomGetAmountOfMessagesFailureAction,
  roomGetAmountOfMessagesSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomSwitchAction,
  roomSwitchFailureAction,
  roomSwitchSuccessAction
} from "./room-chat.actions";
import {map, of, switchMap, tap} from "rxjs";
import {ChatService} from "../../shared/services/chat.service";
import {catchError} from "rxjs/operators";
import {SocketService} from "../../shared/services/socket.service";
import {roomByIdSelect} from "./room-chat.selectors";

@Injectable()
export class RoomChatEffect {
  allRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatGetAvailableRooms),
    switchMap(() => this.socketService.listenGetAllRooms().pipe(
      map((data) => chatGetAvailableRoomsSucces({rooms: data})),
      catchError(() => of(chatGetAvailableRoomsFailure)),
    )),
  ));

  amountOfMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetAmountOfMessagesAction),
    switchMap(({roomId}) => this.chatService.getRoomMessagesamount(roomId).pipe(
      map((data) => roomGetAmountOfMessagesSuccessAction({amount: +data})),
      catchError(() => of(roomGetAmountOfMessagesFailureAction)),
    ))
  ));

  switchRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomSwitchAction),
    switchMap(({roomId}) => this.store.select(roomByIdSelect(roomId)).pipe(
      //@ts-ignore
      map((value) => roomSwitchSuccessAction({room: value})),
      catchError(() => of(roomSwitchFailureAction)),
    )))
  );

  roomMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetMessagesAction),
    switchMap(({roomId, offset, limit}) => this.chatService.getRoomContent(roomId, 0, limit).pipe(
      map((messages) => roomGetMessagesSuccessAction({messages})),
      catchError(() => of(roomGetMessagesFailureAction))))
  ));

  constructor(private actions$: Actions,
              private chatService: ChatService,
              private socketService: SocketService,
              private store: Store) {
  }
}
