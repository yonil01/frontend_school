import { createReducer, on } from '@ngrx/store';
import {controlLogin, controlTimeout} from "@app/core/store/actions/token.action";
// import { controlTimeout, controlLogin } from 'core/store/actions/token.action';

export interface TokenState {
  timeout: number;
  logged: boolean;
}

export const TokenInitialState: TokenState = {
  timeout: 0,
  logged: false,
};

const tokenReducer = createReducer(
  TokenInitialState,
  on(controlTimeout, (state, { timeout }) => ({
    ...state,
    timeout,
  })),
  on(controlLogin, (state, { logged }) => ({
    ...state,
    logged,
  })),
);

export function TokenReducer(state: any, action:any) {
  return tokenReducer(state, action);
}
