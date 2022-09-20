import { createReducer, on } from "@ngrx/store";
import {
  roomGetAmountOfMessagesAction,
  roomGetAmountOfMessagesFailureAction,
  roomGetAmountOfMessagesSuccessAction,
  roomGetMessagesAction,
  roomGetMessagesFailureAction,
  roomGetMessagesSuccessAction,
  roomGetNewMessageAction,
  roomLoadMessagesAction,
  roomLoadMessagesFailureAction,
  roomLoadMessagesSuccessAction,
  roomMessageReadAction,
  roomMessageRemoveAction,
  roomUpdateMessageAction,
} from "./room.actions";
import { IMessage } from "../../shared/models/IMessage";
import { chatRoomSwitchAction } from "../chat/chat.actions";

export interface IRoomChatState {
  selectedRoomId: string | null,
  messages: IMessage[],
  totalMessages: number,
  offset: number,
  isLoading: boolean,
  hasMessagesValue: boolean,
}

const initialRoomState: IRoomChatState = {
  selectedRoomId: null,
  messages: [],
  totalMessages: 50,
  offset: 0,
  isLoading: false,
  hasMessagesValue: false,
};

export const roomReducer = createReducer(
  initialRoomState,

  on(chatRoomSwitchAction, (state, action) => {
    if (action.roomId) {
      return ({
        ...state,
        selectedRoom: action.roomId ?? null,
      });
    } else return ({ ...state, selectedRoom: null });
  }),

  on(roomGetMessagesAction, (state) => ({
    ...state,
    isLoading: true,
    hasMessagesValue: false,
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
    messages: [],
  })),

  on(roomGetNewMessageAction, (state, action) => {
    if (!state.selectedRoomId || action.roomId === state.selectedRoomId) {
      const newMessagesArr = state.messages.slice();
      newMessagesArr.push({ ...action.message });
      return ({
        ...state,
        messages: newMessagesArr,
        totalMessages: state.totalMessages + 1,
      });
    } else return ({ ...state });
  }),

  on(roomMessageReadAction, (state, action) => {
    const newMessagesArr = [...state.messages].map((message: IMessage) => {
      if (message._id === action.messageId && message.read.indexOf(action.userId) === -1) {
        message = { ...message, read: [...message.read, action.userId] };
      }
      return message;
    });

    return ({
      ...state,
      messages: newMessagesArr,
    });
  }),

  on(roomLoadMessagesAction, (state) => ({
    ...state,
    isLoading: true,
    offset: state.offset + 50 >= state.totalMessages ? state.totalMessages : state.offset + 50,
  })),
  on(roomLoadMessagesSuccessAction, (state, action) => {
    if (action.messages[0]._id === state.messages[0]._id)
      return ({ ...state });

    const newState = { ...state, isLoading: false };
    const newMessagesArr = state.messages.slice();
    newMessagesArr.unshift(...action.messages);
    // } else return ({
    //   ...newState,
    //   messages: newMessagesArr,
    //  });
    return ({
      ...newState,
      messages: newMessagesArr,
    });
  }),
  on(roomLoadMessagesFailureAction, (state) => ({
    ...state,
    isLoading: false,
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
    totalMessages: 0,
  })),

  on(roomUpdateMessageAction, (state, action) => {
    const newMessages = state.messages.map((message: IMessage) => {
      if (message._id === action.messageId) {
        return { ...message, content: action.correction };
      }
      return message;
    });

    return ({ ...state, messages: newMessages });
  }),

  on(roomMessageRemoveAction, (state, action) => ({
    ...state,
    messages: state.messages.filter((message) => action.messageId !== message._id)
  })),
);
