import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IRoomChatState } from "./room.reducer";

export const roomChatFeatureSelector = createFeatureSelector<IRoomChatState>("room");

export const messagesSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.messages
);

export const offsetSelector = createSelector(
  roomChatFeatureSelector,
  (roomState: IRoomChatState) => roomState.offset
);

export const currentRoomSelector = () => createSelector(
  roomChatFeatureSelector,
  (chatState: IRoomChatState) => chatState.selectedRoomId,
);

export const hasRoomMessagesValueSelector = () => createSelector(
  roomChatFeatureSelector,
  (chatState: IRoomChatState) => chatState.messages !== [],
);
