import { IRoom } from "../../shared/models/IRoom";
import { createReducer, on } from "@ngrx/store";
import {
  chatGetAvailableRooms,
  chatGetAvailableRoomsSucces,
  chatSearchRoomsActions,
  chatSearchRoomsFailureAction,
  chatSearchRoomsSuccesAction,
  roomAddParticipantAction,
  roomAddParticipantFailureAction,
  roomAddParticipantSuccessAction,
  roomGetAmountOfMessagesAction,
  roomGetAmountOfMessagesFailureAction,
  roomGetAmountOfMessagesSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomGetNewMessageAction,
  roomGetNewMessageFailureAction,
  roomGetNewMessageSuccessAction,
  roomGetUnreadAction,
  roomGetUnreadFailureAction,
  roomGetUnreadSuccessAction,
  roomLoadMessagesAction,
  roomLoadMessagesFailureAction,
  roomLoadMessagesSuccessAction,
  roomMessageReadAction,
  roomMessageReadFailureAction,
  roomMessageReadSuccessAction,
  roomMessageRemoveAction,
  roomMessageRemoveFailureAction,
  roomMessageRemoveSuccessAction,
  roomRemoveParticipantAction,
  roomRemoveParticipantFailureAction,
  roomRemoveParticipantSuccessAction,
  roomSendMessageAction,
  roomSendMessageFailureAction,
  roomSendMessageSuccessAction,
  roomSwitchAction,
  roomSwitchFailureAction,
  roomSwitchSuccessAction,
  roomUpdateMessageAction,
  roomUpdateMessageFailureAction,
  roomUpdateMessageSuccessAction
} from "./room-chat.actions";
import { IMessage } from "../../shared/models/IMessage";

export interface IRoomChatState {
  allRooms: IRoom[],
  selectedRoom: IRoom | null,
  messages: IMessage[],
  totalMessages: number,
  offset: number,
  isLoading: boolean,
  hasRoomValue: boolean,
  hasMessagesValue: boolean,
}

const initialRoomState: IRoomChatState = {
  allRooms: [],
  selectedRoom: null,
  messages: [],
  totalMessages: 50,
  offset: 0,
  isLoading: false,
  hasRoomValue: false,
  hasMessagesValue: false,
};

export const roomChatReducer = createReducer(
  initialRoomState,

  on(roomSwitchAction, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(roomSwitchSuccessAction, (state, action) => ({
    ...state,
    selectedRoom: action.room,
    // totalMessages: 50,
    offset: 0,
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

  on(roomGetNewMessageAction, (state) => ({
    ...state,
  })),
  on(roomGetNewMessageSuccessAction, (state, action) => {
    const rooms = state.allRooms.slice().map((room: IRoom) => {
      if (room._id === action.roomId)
        room = { ...room, unread: 1 + room.unread };
      return room;
    });
    if (!state.selectedRoom || action.roomId === state.selectedRoom?._id) {
      const newMessagesArr = state.messages.slice();
      newMessagesArr.push({ ...action.message });
      return ({
        ...state,
        messages: newMessagesArr,
        allRooms: rooms
      });
    } else return ({ ...state, allRooms: rooms });
  }),
  on(roomGetNewMessageFailureAction, (state) => ({
    ...state,
  })),

  on(roomMessageReadAction, (state) => ({
    ...state,
  })),
  on(roomMessageReadSuccessAction, (state, action) => {
    const newMessagesArr = [...state.messages].map((message: IMessage) => {
      if (message._id === action.messageId && message.read.indexOf(action.userId) === -1) {
        message = { ...message, read: [...message.read, action.userId] };
      }
      return message;
    });

    const rooms = [...state.allRooms].map((room: IRoom) => {
      if (state.selectedRoom !== null && room._id === state.selectedRoom._id)
        room = { ...room, unread: room.unread - 1 };
      return room;
    });

    return ({
      ...state,
      messages: newMessagesArr,
      allRooms: rooms,
    });
  }),
  on(roomMessageReadFailureAction, (state) => ({
    ...state,
  })),

  on(roomLoadMessagesAction, (state) => ({
    ...state,
    isLoading: true,
    offset: state.offset + 50 > state.totalMessages ? state.totalMessages : state.offset + 50,
  })),
  on(roomLoadMessagesSuccessAction, (state, action) => {
    const newState = { ...state, isLoading: false };
    const newMessagesArr = state.messages.slice();
    newMessagesArr.unshift(...action.messages);

    return ({ ...newState, messages: newMessagesArr });
  }),
  on(roomLoadMessagesFailureAction, (state) => ({
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

  on(roomUpdateMessageAction, (state) => ({
    ...state,
  })),
  on(roomUpdateMessageSuccessAction, (state, action) => {
    const newMessages = state.messages.map((message: IMessage) => {
      if (message._id === action.messageId) {
        return { ...message, content: action.correction };
      }
      return message;
    });

    return ({ ...state, messages: newMessages });
  }),
  on(roomUpdateMessageFailureAction, (state) => ({
    ...state,
  })),

  on(roomMessageRemoveAction, (state) => ({
    ...state,
  })),
  on(roomMessageRemoveSuccessAction, (state, action) => {
    return ({
      ...state,
      messages: state.messages.filter((message) => action.messageId !== message._id)
    });
  }),
  on(roomMessageRemoveFailureAction, (state) => ({
    ...state,
  })),

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

  on(roomGetUnreadAction, (state, action) => {
    let newRoomArr = [...state.allRooms].map((room: IRoom) => {
      if (room._id === action.roomId) {
        room = { ...room, unread: 0 };
      }
      return room;
    });

    return ({
      ...state,
      allRooms: newRoomArr,
    });
  }),
  on(roomGetUnreadSuccessAction, (state, action) => {
    let newRoomArr = [...state.allRooms].map((room: IRoom) => {
      if (room._id === action.roomId) {
        console.log("(room-chat reducer)", action.roomId, +action.unread);
        room = { ...room, unread: +action.unread };
      }
      return room;
    });

    return ({
      ...state,
      allRooms: newRoomArr,
    });
  }),
  on(roomGetUnreadFailureAction, (state) => ({
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

  on(chatSearchRoomsActions, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(chatSearchRoomsSuccesAction, (state, action) => ({
    ...state,
    allRooms: action.rooms,
    isLoading: false,
  })),
  on(chatSearchRoomsFailureAction, (state) => ({
    ...state,
    isLoading: false,
  })),
);
