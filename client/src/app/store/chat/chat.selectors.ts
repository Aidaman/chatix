import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IChatState } from "./chat.reducer";

export const chatFeatureSelector = createFeatureSelector<IChatState>("chat");

export const hasRoomValueSelector = createSelector(
  chatFeatureSelector,
  (chatState: IChatState) => chatState.hasRoomValue
);

export const isAllRoomsHasValue = createSelector(
  chatFeatureSelector,
  (chatState: IChatState) => chatState.allRooms !== []
);

export const allRoomsSelector = createSelector(
  chatFeatureSelector,
  (chatState: IChatState) => chatState.allRooms
);

export const roomByIdSelect = (id: string) => createSelector(
  chatFeatureSelector,
  (chatState: IChatState) => {
    if (chatState.allRooms) {
      return chatState.allRooms.find((value) => value._id === id) ?? null;
    } else return null;
  },
);

export const currentRoomSelector = () => createSelector(
  chatFeatureSelector,
  (chatState: IChatState) => chatState.selectedRoom,
);
