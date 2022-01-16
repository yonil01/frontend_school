import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';

export interface AppState {
  bpm: reducers.BpmState;
  role: reducers.RoleState;
  entity: reducers.EntityState;
  doctype: reducers.DoctypeState;
  doctypeGroup: reducers.DoctypeGroup;
  menuDocuments: reducers.MenuDocumentsState;
  // dynamicForms: reducers.DynamicFormsState;
  documentSource: reducers.DocumentSourceState;
  token: reducers.TokenState;
  component: reducers.ComponentState;
  env: reducers.EnvState;
  // TODO Si necesita mas estados pongalos aqui
}

export const appReducers: ActionReducerMap<AppState> = {
  bpm: reducers.BpmReducer,
  entity: reducers.EntityReducer,
  doctype: reducers.DoctypeReducer,
  role: reducers.RoleReducer,
  doctypeGroup: reducers.DoctypeGroupReducer,
  menuDocuments: reducers.MenuDocumentReducer,
  // dynamicForms: reducers.DynamicFormsReducer,
  documentSource: reducers.DocumentSourceReducer,
  token: reducers.TokenReducer,
  component: reducers.ComponentReducer,
  env: reducers.EnvReducer
};
