import { createReducer, on } from '@ngrx/store';
import { Comment } from '@app/core/models/doc/comment';
import {
  controlHistorialWorkflow,
  controlComments,
  controlHistorialDocument,
  controlSimpleEntities,
  controlMultipleEntities,
  controlTabMenuItems,
  controlTraceability,
  resetStoreMenuDocument,
  controlModuleName,
  controlMobileBack,
  controlMobileVisor,
} from '@app/core/store/actions/menu-documents.action';

export interface MenuDocumentsState {
  tabMenuItems: any[];
  comments: Comment[];
  traceability: any[];
  historialWorkflow: any[];
  historialDocument: any[];
  showSimpleEntities: boolean;
  showMultipleEntities: boolean;
  moduleName: string;
  mobileBack: boolean;
  mobileVisor: boolean;
}

export const MenuDocumentsInitialState: MenuDocumentsState = {
  tabMenuItems: [],
  comments: [],
  traceability: [],
  historialWorkflow: [],
  historialDocument: [],
  showSimpleEntities: false,
  showMultipleEntities: false,
  moduleName: '',
  mobileBack: false,
  mobileVisor: false,
};

const menuDocumentReducer = createReducer(
  MenuDocumentsInitialState,

  on(controlComments, (state, { comments }) => ({
    ...state,
    comments,
  })),

  on(controlTraceability, (state, { traceability }) => ({
    ...state,
    traceability,
  })),

  on(controlHistorialWorkflow, (state, { historialWorkflow }) => ({
    ...state,
    historialWorkflow,
  })),

  on(controlHistorialDocument, (state, { historialDocument }) => ({
    ...state,
    historialDocument,
  })),

  on(controlSimpleEntities, (state, { showSimpleEntities }) => ({
    ...state,
    showSimpleEntities,
  })),

  on(controlMultipleEntities, (state, { showMultipleEntities }) => ({
    ...state,
    showMultipleEntities,
  })),

  on(controlTabMenuItems, (state, { tabMenuItems }) => ({
    ...state,
    tabMenuItems,
  })),

  on(controlModuleName, (state, { moduleName }) => ({
    ...state,
    moduleName,
  })),

  on(controlMobileBack, (state, { mobileBack }) => ({
    ...state,
    mobileBack,
  })),
  on(controlMobileVisor, (state, { mobileVisor }) => ({
    ...state,
    mobileVisor,
  })),

  on(resetStoreMenuDocument, (state) => ({
    ...state,
    ...MenuDocumentsInitialState,
  })),
);

export function MenuDocumentReducer(state:any, action:any) {
  return menuDocumentReducer(state, action);
}
