import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {
  chatGetAvailableRooms, chatGetAvailableRoomsFailure,
  chatGetAvailableRoomsSucces,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomSendMessageAction, roomSwitchAction, roomSwitchFailureAction, roomSwitchSuccessAction
} from "./room-chat.actions";
import {map, of, switchMap, tap, throwError} from "rxjs";
import {ChatService} from "../../shared/services/chat.service";
import {catchError} from "rxjs/operators";
import {SocketService} from "../../shared/services/socket.service";
import {roomByIdSelect} from "./room-chat.selectors";

@Injectable()
export class RoomChatEffect {
  allRooms$ = createEffect(()=> this.actions$.pipe(
    ofType(chatGetAvailableRooms),
    switchMap(()=>this.socketService.listenGetAllRooms().pipe(
      tap((value) => {console.log(value)}),
      map((data)=> chatGetAvailableRoomsSucces({rooms: data})),
      catchError(()=> of(chatGetAvailableRoomsFailure)),
    )),
  ));

  switchRoom$ = createEffect(()=> this.actions$.pipe(
    ofType(roomSwitchAction),
    switchMap(({roomId}) => this.store.select(roomByIdSelect(roomId)).pipe(
      // console.log("(Room Chat Effect) switch room event, switchMap Map: value.id and value.title", value._id, value.title);
      //@ts-ignore
      map((value) => roomSwitchSuccessAction({room: value})),
      catchError(()=> of(roomSwitchFailureAction)),
    )))
  );

  roomMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetMessagesAction),
    switchMap(({roomId, offset}) => this.chatService.getRoomContent(roomId, 0, 50).pipe(
        map((messages) => roomGetMessagesSuccessAction({messages})),
        catchError(() => of(roomGetMessagesFailureAction))))
  ));

  // roomSendMessage$ = createEffect(() => this.actions$.pipe(
  //   ofType(roomSendMessageAction),
  //   switchMap(({message}) => this.
  //   )
  // ))

  constructor(private actions$: Actions,
              private chatService: ChatService,
              private socketService: SocketService,
              private store: Store) {}
}
