import { ActionTypes } from "../action.types";
import { createAction, props } from "@ngrx/store";
import { IMessage } from "../../shared/models/IMessage";

export const roomGetMessagesAction = createAction(
  ActionTypes.ROOM_GET_MESSAGES,
  props<{ roomId: string }>(),
);

export const roomGetMessagesSuccessAction = createAction(
  ActionTypes.ROOM_GET_MESSAGES_SUCCESS,
  props<{ messages: IMessage[] }>(),
);

export const roomGetMessagesFailureAction = createAction(
  ActionTypes.ROOM_GET_MESSAGES_FAILURE,
);

export const roomGetNewMessageAction = createAction(
  ActionTypes.ROOM_AND_CHAT_GET_NEW_MESSAGE,
  props<{ message: IMessage, roomId: string }>(),
);

export const roomMessageReadAction = createAction(
  ActionTypes.ROOM_AND_CHAT_MESSAGE_READ,
  props<{ messageId: string, userId: string }>(),
);

export const roomMessageReadSuccessAction = createAction(
  ActionTypes.ROOM_AND_CHAT_MESSAGE_READ_SUCCESS,
  props<{ messageId: string, userId: string }>(),
);

export const roomMessageReadFailureAction = createAction(
  ActionTypes.ROOM_AND_CHAT_MESSAGE_READ_FAILURE,
);

export const roomLoadMessagesAction = createAction(
  ActionTypes.ROOM_LOAD_MESSAGES,
  props<{ roomId: string }>(),
);

export const roomLoadMessagesSuccessAction = createAction(
  ActionTypes.ROOM_LOAD_MESSAGES_SUCCESS,
  props<{ messages: IMessage[] }>(),
);

export const roomLoadMessagesFailureAction = createAction(
  ActionTypes.ROOM_LOAD_MESSAGES_FAILURE,
);

export const roomGetAmountOfMessagesAction = createAction(
  ActionTypes.ROOM_GET_AMOUNT_OF_MESSAGES,
  props<{ roomId: string }>(),
);

export const roomGetAmountOfMessagesSuccessAction = createAction(
  ActionTypes.ROOM_GET_AMOUNT_OF_MESSAGES_SUCCESS,
  props<{ amount: number }>(),
);

export const roomGetAmountOfMessagesFailureAction = createAction(
  ActionTypes.ROOM_GET_AMOUNT_OF_MESSAGES_FAILURE,
);

export const roomUpdateMessageAction = createAction(
  ActionTypes.ROOM_UPDATE_MESSAGE,
  props<{ messageId: string, correction: string }>()
);


export const roomMessageRemoveAction = createAction(
  ActionTypes.ROOM_REMOVE_MESSAGE,
  props<{ messageId: string }>()
);
