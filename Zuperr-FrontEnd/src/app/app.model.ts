export interface IAppReducerState {
    sessionInfo: {
      userId: string | null;
      userType: string | null;
      sessionLoggedIn: boolean;
      sessionStarted: string | null;
    };
  }

export interface IAppSetSession {
    readonly type: "@@app/SET_SESSION";
    payload: {
      userId: string;
      userType: string;
      sessionLoggedIn: boolean;
      sessionStarted: string;
    };
  }

export interface IResetState {
    readonly type: "@@app/RESET_INITIAL_STATE";
}

export type IAppActions = IAppSetSession
