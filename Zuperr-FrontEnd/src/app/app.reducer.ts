import { IAppActions, IAppReducerState } from "./app.model";

export const initialState: IAppReducerState = {
  sessionInfo: {
    userId: localStorage.getItem("userId") || null,
    userType: localStorage.getItem("userType") || null,
    sessionLoggedIn: !!localStorage.getItem("sessionLoggedIn"),
    sessionStarted: localStorage.getItem("sessionStarted") || null
  }
};

export const AppReducer = (
  state: IAppReducerState = initialState,
  action: IAppActions
): IAppReducerState => {
  switch (action.type) {
  case "@@app/SET_SESSION":
    return {
      ...state,
      sessionInfo: {
        ...state.sessionInfo,
        userId: action.payload.userId || null,
        userType: action.payload.userType || null,
        sessionLoggedIn: !!action.payload.sessionLoggedIn,
        sessionStarted: action.payload.sessionStarted || null
      }
    };
  default:
    return state;
  }
};
