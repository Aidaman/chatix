import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IRoomChatState} from "./room-chat.reducer";
import {IRoom} from "../../shared/models/IRoom";
import {of} from "rxjs";

export const roomChatFeatureSelector = createFeatureSelector<IRoomChatState>('room and chat');

export const roomSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.selectedRoom
);

export const messagesSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.messages
);

export const hasRoomValueSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.hasRoomValue
);

export const hasRoomMessagesValueSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.hasMessagesValue
);

export const isRoomLoadingSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.isLoading
);


export const isAllRoomsHasValue = createSelector(
  roomChatFeatureSelector,
  (chatState: IRoomChatState) => chatState.allRooms !== []
)

export const allRoomsSelector = createSelector(
  roomChatFeatureSelector,
  (chatState: IRoomChatState) => chatState.allRooms
)

export const roomByIdSelect = (id: string) => createSelector(
  roomChatFeatureSelector,
  (chatState: IRoomChatState) => {
    const emptyRoom: IRoom = {
      _id: id,
      title: 'empty room',
      users: [],
      creator: null,
      index: -1,
      lastAction: new Date(),
      isPublic: false,
      isFavorites: false,
    }
    if (chatState.allRooms){
      const room = chatState.allRooms.find((value) => value._id === id);
      return room !== undefined ? room : emptyRoom;
    } else return emptyRoom;
  },
)
