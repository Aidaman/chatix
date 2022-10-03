import { ActionTypes } from "../action.types";
import { createAction, props } from "@ngrx/store";
import { IMessage } from "../../shared/models/IMessage";
import { IRoom } from "../../shared/models/IRoom";

export const chatGetNewMessageAction = createAction(
  ActionTypes.CHAT_GET_NEW_MESSAGE,
  props<{ message: IMessage, me: string, roomId: string }>(),
);

export const chatRemoveRoomAction = createAction(
  ActionTypes.CHAT_REMOVE_ROOM,
  props<{ room: IRoom }>(),
);

export const chatGetNewRoomAction = createAction(
  ActionTypes.CHAT_GET_NEW_ROOM,
  props<{ room: IRoom }>(),
);

export const chatMessageReadAction = createAction(
  ActionTypes.CHAT_MESSAGE_READ,
  props<{ roomId: string}>(),
);

export const chatGetAvailableRooms = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS,
  props<{ isPublic?: boolean }>(),
);

export const chatGetAvailableRoomsSuccess = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS_SUCCESS,
  props<{ rooms: IRoom[] }>()
);

export const chatGetAvailableRoomsFailure = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS_FAILURE,
);

export const chatSearchRoomsActions = createAction(
  ActionTypes.CHAT_SEARCH_ROOMS,
  props<{ title: string }>(),
);

export const chatSearchRoomsSuccessActions = createAction(
  ActionTypes.CHAT_SEARCH_ROOMS_SUCCESS,
  props<{ rooms: IRoom[] }>(),
);

export const chatSearchRoomsFailureActions = createAction(
  ActionTypes.CHAT_SEARCH_ROOMS_FAILURE,
);

export const chatRoomSwitchAction = createAction(
  ActionTypes.CHAT_ROOM_SWITCH,
  props<{ roomId: string }>()
);

export const chatRemoveParticipantAction = createAction(
  ActionTypes.CHAT_REMOVE_PARTICIPANT,
  props<{ room: IRoom }>()
);

export const chatAddParticipantAction = createAction(
  ActionTypes.CHAT_ADD_PARTICIPANT,
  props<{ room: IRoom }>(),
);

export const chatRoomRenamedAction = createAction(
  ActionTypes.CHAT_ROOM_RENAMED,
  props<{ roomId: string, title: string }>()
);

export const chatRoomPrivacyChangedAction = createAction(
  ActionTypes.CHAT_ROOM_PRIVACY_CHANGED,
  props<{ id: string, isPublic: boolean }>(),
);
