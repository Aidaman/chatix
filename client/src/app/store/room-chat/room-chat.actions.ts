import {ActionTypes} from "../action.types";
import {createAction, props} from "@ngrx/store";
import {IMessage} from "../../shared/models/IMessage";
import {IUser} from "../../shared/models/IUser";
import {IRoom} from "../../shared/models/IRoom";

export const chatGetAvailableRooms = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS,
  // props<{}>()
)

export const chatGetAvailableRoomsSucces = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS_SUCCESS,
  props<{ rooms: IRoom[] }>()
)

export const chatGetAvailableRoomsFailure = createAction(
  ActionTypes.CHAT_GET_AVAILABLE_ROOMS_FAILURE,
)

export const roomSwitchAction = createAction(
  ActionTypes.ROOM_SWITCH,
  props<{ roomId: string }>()
)

export const roomSwitchSuccessAction = createAction(
  ActionTypes.ROOM_SWITCH_SUCCESS,
  props<{ room: IRoom }>()
)

export const roomSwitchFailureAction = createAction(
  ActionTypes.ROOM_SWITCH_FAILURE,
)

export const roomGetMessagesAction = createAction(
  ActionTypes.ROOM_GET_MESSAGES,
  props<{ roomId: string, offset: number }>(),
)

export const roomGetMessagesSuccessAction = createAction(
  ActionTypes.ROOM_GET_MESSAGES_SUCCESS,
  props<{ messages: IMessage[] }>(),
)

export const roomGetMessagesFailureAction = createAction(
  ActionTypes.ROOM_GET_MESSAGES_FAILURE,
)

export const roomSendMessageAction = createAction(
  ActionTypes.ROOM_SEND_MESSAGE,
  props<{ message: IMessage }>()
)

export const roomSendMessageSuccessAction = createAction(
  ActionTypes.ROOM_SEND_MESSAGE_SUCCESS,
  props<{ messages: IMessage[] }>()
)

export const roomSendMessageFailureAction = createAction(
  ActionTypes.ROOM_SEND_MESSAGE_FAILURE,
)

// export const roomGetParticipantsAction = createAction(
//   ActionTypes.ROOM_GET_PARTICIPANTS,
//   props<{ roomId: string }>()
// )
//
// export const roomGetParticipantsSuccesAction = createAction(
//   ActionTypes.ROOM_GET_PARTICIPANTS_SUCCESS,
//   props<{ participants: IUser[] }>()
// )
//
// export const roomGetParticipantsFailureAction = createAction(
//   ActionTypes.ROOM_GET_PARTICIPANTS_FAILURE,
// )

export const roomRemoveParticipantAction = createAction(
  ActionTypes.ROOM_REMOVE_PARTICIPANT,
  props<{ participantId: string }>()
)

export const roomRemoveParticipantSuccessAction = createAction(
  ActionTypes.ROOM_REMOVE_PARTICIPANT_SUCCESS,
  props<{ room: IRoom }>()
  // props<{ participants: IUser[] }>()
)

export const roomRemoveParticipantFailureAction = createAction(
  ActionTypes.ROOM_REMOVE_PARTICIPANT_FAILURE,
)

export const roomAddParticipantAction = createAction(
  ActionTypes.ROOM_ADD_PARTICIPANT,
  props<{ participantId: string }>(),
)

export const roomAddParticipantSuccessAction = createAction(
  ActionTypes.ROOM_ADD_PARTICIPANT_SUCCESS,
  props<{ room: IRoom }>(),
)

export const roomAddParticipantFailureAction = createAction(
  ActionTypes.ROOM_ADD_PARTICIPANT_FAILURE,
)

// export const roomInviteParticipant = createAction(
//   ActionTypes.ROOM_INVITE_PARTICIPANT,
//   props<{ participantId: string }>(),
// )
//
// export const roomInviteParticipantSuccessAction = createAction(
//   ActionTypes.ROOM_INVITE_PARTICIPANT_SUCCESS,
//   props<{ participants: IUser[] }>(),
// )
//
// export const roomInviteParticipantFailureAction = createAction(
//   ActionTypes.ROOM_INVITE_PARTICIPANT_FAILURE,
// )

