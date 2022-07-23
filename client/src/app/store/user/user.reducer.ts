import {IUser} from "../../shared/models/IUser";
import {
  userAcceptInvitation, userAuthAction, userAuthFailureAction, userAuthSuccessAction,
  userLogoutAction, userRejectInvitation
} from "./user.actions";
import {createReducer, on} from "@ngrx/store";

export interface IUserState {
  user: IUser | null,
  isLoading: boolean,
  hasValue: boolean,
}

const initialUserState: IUserState = {
  user: null,
  isLoading: false,
  hasValue: false,
}

export const userReducer = createReducer(
  initialUserState,

  on(userAuthAction, (state)=>({
      ...state,
      isLoading: true,
    })),
  on(userAuthSuccessAction, (state, action)=>({
      ...state,
      isLoading: false,
      hasValue: true,
      user: action.user
    })),
  on(userAuthFailureAction, (state)=> ({
      ...state,
      hasValue: false,
      isLoading: false,
    })
  ),

  on(userAcceptInvitation, (state) => ({
    ...state,
  })),
  on(userRejectInvitation, (state) => ({
    ...state,
  })),

  on(userLogoutAction, ()=> ({
      user: null,
      isLoading: false,
      hasValue: false,
    }))
)
