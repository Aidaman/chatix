import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IRoomChatState} from "./room-chat.reducer";

export const roomChatFeatureSelector = createFeatureSelector<IRoomChatState>('room and chat');

export const roomSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.selectedRoom
);

export const messagesSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.messages
);

export const offsetSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.offset
);

export const hasRoomValueSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.hasRoomValue
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
  (chatState: IRoomChatState) => chatState.allRooms.find((value) => value._id === id),
)

export const currentRoom = () => createSelector(
  roomChatFeatureSelector,
  (chatState: IRoomChatState) => chatState.selectedRoom,
)
