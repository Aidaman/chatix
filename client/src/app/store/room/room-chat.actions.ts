import { ActionTypes } from "../action.types";
import { createAction, props } from "@ngrx/store";
import { IMessage } from "../../shared/models/IMessage";
import { IRoom } from "../../shared/models/IRoom";

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
  ActionTypes.ROOM_GET_NEW_MESSAGE,
  props<{ message: IMessage, roomId: string }>(),
);

export const roomGetNewMessageSuccessAction = createAction(
  ActionTypes.ROOM_GET_NEW_MESSAGE_SUCCESS,
  props<{ roomId: string, message: IMessage, creator: string }>(),
);

export const roomGetNewMessageFailureAction = createAction(
  ActionTypes.ROOM_GET_NEW_MESSAGE_FAILURE,
);

export const roomMessageReadAction = createAction(
  ActionTypes.ROOM_MESSAGE_READ,
  props<{ messageId: string, userId: string }>(),
);

export const roomMessageReadSuccessAction = createAction(
  ActionTypes.ROOM_MESSAGE_READ_SUCCESS,
  props<{ messageId: string, userId: string }>(),
);

export const roomMessageReadFailureAction = createAction(
  ActionTypes.ROOM_MESSAGE_READ_FAILURE,
);

export const roomLoadMessagesAction = createAction(
  ActionTypes.ROOM_LOAD_MESSAGES,
  // props<{ roomId: string, offset: number}>(),
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

export const roomSendMessageAction = createAction(
  ActionTypes.ROOM_SEND_MESSAGE,
  props<{ message: IMessage }>()
);

export const roomSendMessageSuccessAction = createAction(
  ActionTypes.ROOM_SEND_MESSAGE_SUCCESS,
  props<{ messages: IMessage[] }>()
);

export const roomSendMessageFailureAction = createAction(
  ActionTypes.ROOM_SEND_MESSAGE_FAILURE,
);

export const roomUpdateMessageAction = createAction(
  ActionTypes.ROOM_UPDATE_MESSAGE,
  props<{ messageId: string, correction: string }>()
);

export const roomUpdateMessageSuccessAction = createAction(
  ActionTypes.ROOM_UPDATE_MESSAGE_SUCCESS,
  props<{ messageId: string, correction: string }>()
);

export const roomUpdateMessageFailureAction = createAction(
  ActionTypes.ROOM_UPDATE_MESSAGE_FAILURE,
);

export const roomMessageRemoveAction = createAction(
  ActionTypes.ROOM_REMOVE_MESSAGE,
  props<{ messageId: string }>()
);

export const roomMessageRemoveSuccessAction = createAction(
  ActionTypes.ROOM_REMOVE_MESSAGE_SUCCESS,
  props<{ messageId: string }>()
);

export const roomMessageRemoveFailureAction = createAction(
  ActionTypes.ROOM_REMOVE_MESSAGE_FAILURE,
);

export const roomRemoveParticipantAction = createAction(
  ActionTypes.ROOM_REMOVE_PARTICIPANT,
  props<{ participantId: string }>()
);

export const roomRemoveParticipantSuccessAction = createAction(
  ActionTypes.ROOM_REMOVE_PARTICIPANT_SUCCESS,
  props<{ room: IRoom }>()
  // props<{ participants: IUser[] }>()
);

export const roomRemoveParticipantFailureAction = createAction(
  ActionTypes.ROOM_REMOVE_PARTICIPANT_FAILURE,
);

export const roomAddParticipantAction = createAction(
  ActionTypes.ROOM_ADD_PARTICIPANT,
  props<{ participantId: string }>(),
);

export const roomAddParticipantSuccessAction = createAction(
  ActionTypes.ROOM_ADD_PARTICIPANT_SUCCESS,
  props<{ room: IRoom }>(),
);

export const roomAddParticipantFailureAction = createAction(
  ActionTypes.ROOM_ADD_PARTICIPANT_FAILURE,
);

export const chatGetAvailableRooms = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS,
  // props<{}>()
);

export const chatGetAvailableRoomsSucces = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS_SUCCESS,
  props<{ rooms: IRoom[] }>()
);

export const chatGetAvailableRoomsFailure = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS_FAILURE,
);

export const chatSearchRoomsActions = createAction(
  ActionTypes.CHAT_SEARCH_ROOMS,
);

export const chatSearchRoomsSuccesAction = createAction(
  ActionTypes.CHAT_SEARCH_ROOMS_SUCCESS,
  props<{ rooms: IRoom[] }>()
);

export const chatSearchRoomsFailureAction = createAction(
  ActionTypes.CHAT_SEARCH_ROOMS_FAILURE,
);

export const roomSwitchAction = createAction(
  ActionTypes.ROOM_SWITCH,
  props<{ roomId: string }>()
);

export const roomSwitchSuccessAction = createAction(
  ActionTypes.ROOM_SWITCH_SUCCESS,
  props<{ room: IRoom | null }>()
);

export const roomSwitchFailureAction = createAction(
  ActionTypes.ROOM_SWITCH_FAILURE,
);
