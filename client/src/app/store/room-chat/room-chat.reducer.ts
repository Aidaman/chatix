import {IRoom} from "../../shared/models/IRoom";
import {createReducer, on} from "@ngrx/store";
import {
  chatGetAvailableRooms,
  chatGetAvailableRoomsSucces,
  roomAddParticipantAction,
  roomAddParticipantFailureAction,
  roomAddParticipantSuccessAction, roomGetAmountOfMessagesAction,
  roomGetAmountOfMessagesFailureAction, roomGetAmountOfMessagesSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomRemoveParticipantAction,
  roomRemoveParticipantFailureAction,
  roomRemoveParticipantSuccessAction,
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
  totalMessages: number,
  isLoading: boolean,
  hasRoomValue: boolean,
  hasMessagesValue: boolean,
}

const initialRoomState: IRoomChatState = {
  allRooms: [],
  selectedRoom: null,
  messages: [],
  totalMessages: 50,
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
    totalMessages: 50,
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

  on(roomGetAmountOfMessagesAction, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(roomGetAmountOfMessagesSuccessAction, (state, action) => ({
    ...state,
    isLoading: false,
    totalMessages: action.amount
  })),
  on(roomGetAmountOfMessagesFailureAction, (state) => ({
    ...state,
    isLoading: false,
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
