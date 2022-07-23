import {IRoom} from "../../shared/models/IRoom";
import {createReducer, on} from "@ngrx/store";
import {
  chatGetAvailableRooms, chatGetAvailableRoomsSucces,
  roomAddParticipantAction, roomAddParticipantFailureAction, roomAddParticipantSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomRemoveParticipantAction,
  roomRemoveParticipantFailureAction,
  roomRemoveParticipantSuccessAction,
  // roomGetParticipantsAction,
  // roomGetParticipantsSuccesAction,
  roomSendMessageAction,
  roomSendMessageFailureAction,
  roomSendMessageSuccessAction,
  roomSwitchAction,
  roomSwitchFailureAction,
  roomSwitchSuccessAction
} from "./room-chat.actions";
import {IMessage} from "../../shared/models/IMessage";

export interface IRoomChatState {
  allRooms: IRoom[],
  selectedRoom: IRoom | null,
  messages: IMessage[],
  isLoading: boolean,
  hasRoomValue: boolean,
  hasMessagesValue: boolean,
}

const initialRoomState: IRoomChatState = {
  allRooms: [],
  selectedRoom: null,
  messages: [],
  isLoading: false,
  hasRoomValue: false,
  hasMessagesValue: false,
}

export const roomChatReducer = createReducer(
  initialRoomState,

  on(roomSwitchAction, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(roomSwitchSuccessAction, (state, action) => ({
    ...state,
    room: action.room,
    isLoading: false,
    hasRoomValue: true,
  })),
  on(roomSwitchFailureAction, (state) => ({
    ...state,
    isLoading: false,
    hasRoomValue: false,
  })),

  on(roomGetMessagesAction, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(roomGetMessagesSuccessAction, (state, action) => ({
    ...state,
    isLoading: false,
    messages: action.messages,
    hasMessagesValue: true
  })),
  on(roomGetMessagesFailureAction, (state) => ({
    ...state,
    isLoading: false,
    hasMessagesValue: false,
  })),

  on(roomSendMessageAction, (state) => ({
    ...state,
  })),
  on(roomSendMessageSuccessAction, (state, action) => ({
    ...state,
    messages: action.messages
  })),
  on(roomSendMessageFailureAction, (state) => ({
    ...state,
  })),

  // on(roomGetParticipantsAction, (state) => ({
  //   ...state,
  // })),
  // on(roomGetParticipantsSuccesAction, (state, action) => ({
  //   ...state,
  // }))

  on(roomRemoveParticipantAction, (state) => ({
    ...state
  })),
  on(roomRemoveParticipantSuccessAction, (state, action) => ({
    ...state,
    room: action.room,
  })),
  on(roomRemoveParticipantFailureAction, (state) => ({
    ...state
  })),

  on(roomAddParticipantAction, (state) => ({
    ...state,
  })),
  on(roomAddParticipantSuccessAction, (state, action) => ({
    ...state,
    room: action.room,
  })),
  on(roomAddParticipantFailureAction, (state) => ({
    ...state,
  })),


  on(chatGetAvailableRooms, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(chatGetAvailableRoomsSucces, (state, action) => ({
    ...state,
    allRooms: action.rooms,
    isLoading: false,
  })),
  on(chatGetAvailableRooms, (state) => ({
    ...state,
    isLoading: false,
  })),
);
