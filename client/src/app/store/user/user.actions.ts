import { createAction, props } from "@ngrx/store";
import { ActionTypes } from "../action.types";
import { IUser } from "../../shared/models/IUser";

export const userAuthAction = createAction(
  ActionTypes.USER_AUTH,
);

export const userAuthSuccessAction = createAction(
  ActionTypes.USER_AUTH_SUCCESS,
  props<{user: IUser}>(),
);

export const userAuthFailureAction = createAction(
  ActionTypes.USER_AUTH_FAILURE,
);

export const userLogoutAction = createAction(
  ActionTypes.USER_LOG_OUT,
);
