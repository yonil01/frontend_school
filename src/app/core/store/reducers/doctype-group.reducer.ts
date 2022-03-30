import { createReducer, on } from '@ngrx/store';
import {
  controlEntities,
  controlDocuments,
  controlDocument,
  controlQueue,
  controlProcessAndTokens,
  controlBlockPage,
  resetStoreDoctypeGroups,
  controlAnnexes,
  controlDoctype,
  controlStepEntities,
  deleteStepEntities,
  controlMobileQueue,
} from '@app/core/store/actions/doctype-group.action';
import { Document, Queue, Process, Token, EntityValue, Entity, DocTypes } from '@app/core/models';

export interface DoctypeGroup {
  entities: Entity[];
  stepEntities: EntityValue[];
  documents: Document[];
  selectedDocuments: Document[];
  selectedQueue: Queue;
  selectedProcess: Process;
  tokens: Token[];
  isChangedTokens: boolean;
  isChangedSelectedDocument: boolean;
  isBlockPage: boolean;
  annexes: Document[];
  selectedDoctype: DocTypes;
  mobileQueue: boolean;
}

export const DoctypeGroupInitialState: DoctypeGroup = {
  entities: [],
  stepEntities: [],
  documents: [],
  selectedDocuments: [],
  selectedQueue: {},
  selectedProcess: {},
  tokens: [],
  isChangedTokens: false,
  isChangedSelectedDocument: false,
  isBlockPage: false,
  annexes: [],
  selectedDoctype: {},
  mobileQueue: false,
};

const doctypeGroupreducer = createReducer(
  DoctypeGroupInitialState,
  on(controlEntities, (state, { entities }) => ({
    ...state,
    entities,
    // selectedDocuments: [],
    isChangedTokens: false,
    isChangedSelectedDocument: false,
  })),
  on(controlDocuments, (state, { documents }) => ({
    ...state,
    documents,
    isChangedTokens: false,
    isChangedSelectedDocument: false,
  })),
  on(controlDocument, (state, { selectedDocuments }) => ({
    ...state,
    selectedDocuments,
    isChangedTokens: false,
    isChangedSelectedDocument: true,
  })),
  on(controlQueue, (state, { selectedQueue, documents }) => ({
    ...state,
    selectedQueue,
    documents,
    selectedDocuments: [],
    isChangedTokens: false,
    isChangedSelectedDocument: false,
  })),
  on(controlProcessAndTokens, (state, { selectedProcess, tokens }) => ({
    ...state,
    selectedProcess,
    tokens,
    isChangedTokens: true,
    isChangedSelectedDocument: false,
  })),
  on(controlBlockPage, (state, { isBlockPage }) => ({
    ...state,
    isBlockPage,
    isChangedSelectedDocument: false,
  })),
  on(controlAnnexes, (state, { annexes }) => ({
    ...state,
    annexes,
    isChangedTokens: false,
    isChangedSelectedDocument: false,
  })),
  on(resetStoreDoctypeGroups, (state) => ({
    ...state,
    ...DoctypeGroupInitialState,
  })),
  on(controlDoctype, (state, { selectedDoctype }) => ({
    ...state,
    selectedDoctype,
  })),
  on(controlStepEntities, (state, { stepEntities }) => ({
    ...state,
    stepEntities,
  })),
  on(controlMobileQueue, (state, { mobileQueue }) => ({
    ...state,
    mobileQueue,
    isChangedTokens: true,
  })),
  on(deleteStepEntities, (state) => ({
    ...state,
    stepEntities: [],
  })),
);

export function DoctypeGroupReducer(state: any, action: any) {
  return doctypeGroupreducer(state, action);
}
