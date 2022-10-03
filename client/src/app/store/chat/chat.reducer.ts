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
  chatRemoveParticipantAction,
  chatRemoveRoomAction,
  chatRoomRenamedAction,
  chatRoomPrivacyChangedAction,
  chatGetAvailableRoomsFailure,
  chatGetAvailableRoomsSuccess,
  chatSearchRoomsSuccessActions,
  chatSearchRoomsFailureActions
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
      if (room._id === action.roomId && action.message.creator?._id !== action.me && !action.message.isSystemMessage)
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

  on(chatMessageReadAction, (state, action) => {
    const rooms = [...state.allRooms].map((room: IRoom) => {
      if (room._id === action.roomId) {
        room = { ...room, unread: room.unread - 1 >= 0 ? room.unread - 1 : 0 };
      }
      return room;
    });

    return ({
      ...state,
      allRooms: rooms,
    });
  }),

  on(chatGetAvailableRooms, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(chatGetAvailableRoomsSuccess, (state, action) => ({
    ...state,
    allRooms: action.rooms,
    isLoading: false,
  })),
  on(chatGetAvailableRoomsFailure, (state) => ({
    ...state,
    isLoading: false,
  })),

  on(chatSearchRoomsActions, (state, action) => ({
    ...state,
    isLoading: true,
  })),
  on(chatSearchRoomsSuccessActions, (state, action) => ({
    ...state,
    allRooms: action.rooms,
    isLoading: false,
  })),
  on(chatSearchRoomsFailureActions, (state, action) => ({
    ...state,
    isLoading: false,
  })),

  on(chatRemoveRoomAction, (state, action) => {
    const newAllRooms: IRoom[] = state.allRooms.slice().filter((room) => room._id !== action.room._id);
    return ({
      ...state,
      allRooms: newAllRooms,
    });
  }),

  on(chatRemoveParticipantAction, (state, action) => {
    console.log("user has left the ", action.room)
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
    if (state.allRooms && action.room) {
      const newRooms = [...state.allRooms].map((room) => {
        if (room._id === action.room._id) {
          room = action.room;
        }
        return room;
      });

      return ({
        ...state,
        allRooms: newRooms,
      });
    } else return ({
      ...state,
    });
  }),

  on(chatRoomRenamedAction, (state, action) => {
    const rooms = [...state.allRooms].map((room) => {
      console.log(room._id, action.roomId);
      if (room._id === action.roomId){
        room = { ...room, title: action.title };
      }
      return room;
    });

    return ({
      ...state,
      allRooms: rooms,
    });
  }),

  on(chatRoomPrivacyChangedAction, (state, action) => {
    const rooms = [...state.allRooms].map((room) => {
      if (room._id === action.id){
        room = { ...room, isPublic: action.isPublic };
      }
      return room;
    });

    return ({
      ...state,
      allRooms: rooms,
    });
  }),
);
