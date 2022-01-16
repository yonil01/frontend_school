import { createAction, props } from '@ngrx/store';
import { Document, Queue, Process, Token, EntityValue, Entity, DocTypes } from '@app/core/models';

export const controlEntities = createAction(
  '[Doctype-Group] load doctype group entities',
  props<{ entities: Entity[] }>(),
);

export const controlStepEntities = createAction(
  '[Doctype-Group] load doctype group entities by entity',
  props<{ stepEntities: EntityValue[] }>(),
);

export const deleteStepEntities = createAction('[Doctype-Group] delete doctype group entities by entity', props<any>());

export const controlDocuments = createAction('[Doctype-Group] load documents', props<{ documents: Document[] }>());
export const controlDocument = createAction(
  '[Doctype-Group] load document',
  props<{ selectedDocuments: Document[] }>(),
);

export const controlQueue = createAction(
  '[Doctype-Group] load queue',
  props<{ selectedQueue: Queue; documents: Document[] }>(),
);

export const controlProcessAndTokens = createAction(
  '[Doctype-Group] load process',
  props<{ selectedProcess: Process; tokens: Token[] }>(),
);

export const controlBlockPage = createAction('[Doctype-Group] blockPage', props<{ isBlockPage: boolean }>());

export const controlAnnexes = createAction('[Doctype-Group] load annexes', props<{ annexes: Document[] }>());

export const controlDoctype = createAction(
  '[Doctype-Group] load selectedDoctype',
  props<{ selectedDoctype: DocTypes }>(),
);

export const controlMobileQueue = createAction('[Doctype-Group] load MobileQueue', props<{ mobileQueue: boolean }>());
export const resetStoreDoctypeGroups = createAction('[Doctype-Group] reset store', props<any>());
