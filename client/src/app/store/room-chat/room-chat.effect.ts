import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {
  chatGetAvailableRooms,
  chatGetAvailableRoomsFailure,
  chatGetAvailableRoomsSucces,
  chatSearchRoomsActions, chatSearchRoomsFailureAction,
  chatSearchRoomsSuccesAction,
  roomGetAmountOfMessagesAction,
  roomGetAmountOfMessagesFailureAction,
  roomGetAmountOfMessagesSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomGetNewMessageAction,
  roomGetNewMessageFailureAction,
  roomGetNewMessageSuccessAction,
  roomLoadMessagesAction,
  roomLoadMessagesFailureAction,
  roomLoadMessagesSuccessAction,
  roomMessageReadAction,
  roomMessageReadFailureAction,
  roomMessageReadSuccessAction,
  roomMessageRemoveAction,
  roomMessageRemoveFailureAction,
  roomMessageRemoveSuccessAction,
  roomSwitchAction,
  roomSwitchFailureAction,
  roomSwitchSuccessAction,
  roomUpdateMessageAction,
  roomUpdateMessageFailureAction,
  roomUpdateMessageSuccessAction
} from "./room-chat.actions";
import {map, of, switchMap, tap, throwError} from "rxjs";
import {ChatService} from "../../shared/services/chat.service";
import {catchError} from "rxjs/operators";
import {SocketService} from "../../shared/services/socket.service";
import {hasRoomValueSelector, offsetSelector, roomByIdSelect} from "./room-chat.selectors";
import {SnackBarNotificationService} from "../../shared/services/snack-bar-notification.service";

@Injectable()
export class RoomChatEffect {
  allRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatGetAvailableRooms),
    switchMap(() => this.socketService.listenGetAllRooms().pipe(
      map((data) => chatGetAvailableRoomsSucces({rooms: data})),
      catchError(() => of(chatGetAvailableRoomsFailure)),
    )),
  ));

  searchRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatSearchRoomsActions),
    switchMap(() => this.socketService.listenSearchRoomsResult().pipe(
      map((data) => chatSearchRoomsSuccesAction({rooms: data})),
      catchError(() => of(chatSearchRoomsFailureAction)),
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
    switchMap(({roomId}) => this.chatService.getRoomContent(roomId, 0, 50).pipe(
      map((messages) => roomGetMessagesSuccessAction({messages})),
      catchError(() => of(roomGetMessagesFailureAction))))
  ));

  loadMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomLoadMessagesAction),
    switchMap(({roomId}) => this.store.select(offsetSelector).pipe(
      switchMap((offset) => this.chatService.getRoomContent(roomId, offset, 50).pipe(
        map((messages) => roomLoadMessagesSuccessAction({messages})),
        catchError(() => of(roomLoadMessagesFailureAction))))
    )),
  ));

  newMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetNewMessageAction),
    switchMap(({roomId, message}) => this.store.select(hasRoomValueSelector).pipe(
      tap(()=>{
        if (message.creator?._id !== this.chatService.me)
          this.snackBar.openSnackBar("You receive new Message", "");
      }),
      map(() => roomGetNewMessageSuccessAction({message, roomId})),
      catchError(() => of(roomGetNewMessageFailureAction))))
  ));

  updateMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomUpdateMessageAction),
    tap(()=>this.snackBar.openSnackBar("Message has been updated","Ok")),
    map(({messageId, correction}) => roomUpdateMessageSuccessAction({messageId, correction})),
    catchError(() => of(roomUpdateMessageFailureAction)),
  ));

  deleteMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomMessageRemoveAction),
    tap(()=>this.snackBar.openSnackBar("Message has been deleted","Ok")),
    map(({messageId}) => roomMessageRemoveSuccessAction({messageId})),
    catchError(() => of(roomMessageRemoveFailureAction)),
  ));

  readMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomMessageReadAction),
    map(({messageId, userId}) => roomMessageReadSuccessAction({messageId, userId})),
    catchError(() => of(roomMessageReadFailureAction))
  ));

  constructor(private actions$: Actions,
              private chatService: ChatService,
              private snackBar: SnackBarNotificationService,
              private socketService: SocketService,
              private store: Store) {
  }
}
