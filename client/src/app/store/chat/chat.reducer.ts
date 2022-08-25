import { IRoom } from "../../shared/models/IRoom";
import { createReducer, on } from "@ngrx/store";
import {
  chatGetAvailableRooms,
  chatSearchRoomsActions,
  chatGetNewMessageAction,
  chatRoomSwitchAction,
  chatMessageReadAction,
  chatGetNewRoomAction,
  chatAddParticipantAction,
  chatRemoveParticipantAction, chatRemoveRoomAction
} from "./chat.actions";

export interface IChatState {
  allRooms: IRoom[],
  selectedRoom: IRoom | null,
  isLoading: boolean,
  hasRoomValue: boolean,
}

const initialChatState: IChatState = {
  allRooms: [],
  selectedRoom: null,
  isLoading: false,
  hasRoomValue: false,
};

export const chatReducer = createReducer(
  initialChatState,

  on(chatRoomSwitchAction, (state, action) => {
    if (action.roomId && state.allRooms) {
      const foundRoom = state.allRooms.find(room => room._id === action.roomId);
      return ({
        ...state,
        selectedRoom: foundRoom ?? null,
        isLoading: false,
        hasRoomValue: foundRoom !== undefined,
      });
    } else return ({ ...state, selectedRoom: null, isLoading: false, hasRoomValue: false });
  }),

  on(chatGetNewMessageAction, (state, action) => {
    const rooms = state.allRooms.slice().map((room: IRoom) => {
      if (room._id === action.roomId && action.message.creator?._id !== action.creator && !action.message.isSystemMessage)
        room = { ...room, unread: room.unread + 1 < 0? 0 : room.unread + 1 };
      return room;
    });

    return ({
      ...state,
      allRooms: rooms
    });
  }),

  on(chatGetNewRoomAction, (state, action) => {
    const newAllRooms = [...state.allRooms];
    newAllRooms.push(action.room);

    return({
      ...state,
      allRooms: newAllRooms
    });
  }),

  on(chatMessageReadAction, (state) => {
    const rooms = [...state.allRooms].map((room: IRoom) => {
      if (state.selectedRoom !== null && room._id === state.selectedRoom._id)
        room = { ...room, unread: room.unread - 1 > 0? room.unread - 1 : 0 };
      return room;
    });

    return ({
      ...state,
      allRooms: rooms,
    });
  }),

  on(chatGetAvailableRooms, (state, action) => ({
    ...state,
    allRooms: action.rooms,
    isLoading: false,
  })),

  on(chatSearchRoomsActions, (state, action) => ({
    ...state,
    allRooms: action.rooms,
    isLoading: false,
  })),

  on(chatRemoveRoomAction, (state, action) => ({
    ...state,
    allRooms: [...state.allRooms.filter((room) => room._id !== action.room._id)]
  })),

  on(chatRemoveParticipantAction, (state, action) => {
    const newRooms = [...state.allRooms].map((room) => {
      if (room._id === action.room._id){
        room = action.room;
      }
      return room;
    });

    return ({
      ...state,
      allRooms: newRooms,
    });
  }),

  on(chatAddParticipantAction, (state, action) => {
    const newRooms = [...state.allRooms].map((room) => {
      if (room._id === action.room._id){
        room = action.room;
      }
      return room;
    });

    return ({
      ...state,
      allRooms: newRooms,
    });
  }),
);
