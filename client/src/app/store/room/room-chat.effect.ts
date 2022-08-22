import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {
  chatGetAvailableRooms,
  chatGetAvailableRoomsFailure,
  chatGetAvailableRoomsSucces,
  chatSearchRoomsActions, chatSearchRoomsFailureAction,
  chatSearchRoomsSuccessAction,
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
import { map, of, switchMap, tap, } from "rxjs";
import { ChatService } from "../../shared/services/chat.service";
import { catchError } from "rxjs/operators";
import { SocketService } from "../../shared/services/socket.service";
import { hasRoomValueSelector, offsetSelector, roomByIdSelect } from "./room-chat.selectors";
import { SnackBarNotificationService } from "../../shared/services/snack-bar-notification.service";
import { IRoom } from "../../shared/models/IRoom";
import { ScrollService } from "../../shared/services/scroll.service";

@Injectable()
export class RoomChatEffect {
  /*
  * @description effect that updates room list
  */
  allRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatGetAvailableRooms),
    switchMap(() => this.socketService.listenGetAllRooms().pipe(
      map((data) => chatGetAvailableRoomsSucces({ rooms: data })),
      catchError(() => of(chatGetAvailableRoomsFailure())),
    )),
  ));


  /*
  * @description effect that "searches" the room
  * (Does not work for now)
  */
  searchRooms$ = createEffect(() => this.actions$.pipe(
    ofType(chatSearchRoomsActions),
    switchMap(() => this.socketService.listenSearchRoomsResult().pipe(
      map((data) => chatSearchRoomsSuccessAction({ rooms: data })),
      catchError(() => of(chatSearchRoomsFailureAction())),
    )),
  ));

  /*
  * @description effect that updates total of the messages in the room
  */
  amountOfMessages$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetAmountOfMessagesAction),
    switchMap(({ roomId }) => this.chatService.getRoomMessagesamount(roomId).pipe(
      map((data) => roomGetAmountOfMessagesSuccessAction({ amount: +data })),
      catchError(() => of(roomGetAmountOfMessagesFailureAction())),
    ))
  ));

  /*
  * @description effect that switches the room
  */
  switchRoom$ = createEffect(() => this.actions$.pipe(
    ofType(roomSwitchAction),
    switchMap(({ roomId }) => this.store.select(roomByIdSelect(roomId)).pipe(
      map((value: IRoom | null) => {
        this.scrollService.roomSwitched.next({ roomId: value?._id ?? "common" });
        return roomSwitchSuccessAction({ room: value });
      }),
      catchError(() => of(roomSwitchFailureAction())),
    )))
  );

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

  newMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomGetNewMessageAction),
    switchMap(({ roomId, message }) => this.store.select(hasRoomValueSelector).pipe(
      map(() => roomGetNewMessageSuccessAction({ message, roomId, creator: this.chatService.me })),
      // tap(() => {
      //     if (this.chatService.lastMessageCreatorId === this.chatService.me)
      //       this.scrollService.scrollDown$.next(true);
      //     else this.scrollService.scrollDown$.next(false);
      // }),
      catchError(() => of(roomGetNewMessageFailureAction()))))
  ));

  updateMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomUpdateMessageAction),
    map(({ messageId, correction }) => roomUpdateMessageSuccessAction({ messageId, correction })),
    catchError(() => of(roomUpdateMessageFailureAction())),
  ));

  deleteMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomMessageRemoveAction),
    map(({ messageId }) => roomMessageRemoveSuccessAction({ messageId })),
    catchError(() => of(roomMessageRemoveFailureAction())),
  ));

  readMessage$ = createEffect(() => this.actions$.pipe(
    ofType(roomMessageReadAction),
    map(({ messageId, userId }) => roomMessageReadSuccessAction({ messageId, userId })),
    catchError(() => of(roomMessageReadFailureAction()))
  ));

  constructor(private actions$: Actions,
              private chatService: ChatService,
              private snackBar: SnackBarNotificationService,
              private socketService: SocketService,
              private scrollService: ScrollService,
              private store: Store) {
  }
}
