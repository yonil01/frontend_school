import { DocTypeGroups, DocTypes, DoctypeEntities, Entity } from '@app/core/models';
import { createReducer, on } from '@ngrx/store';
import {
  showDoctypegroup,
  cancelAddDoctypegroup,
  controlDoctypegroup,
  controlDoctypegroups,
  savedDoctypegroup,
  addDoctypegroup,
  editDoctypegroup,
  controlDoctype,
  controlDoctypes,
  deleteDocType,
  editDoctype,
  addDoctype,
  cancelAddDocType,
  showAddDocType,
  addAutoname,
  controlAutoname,
  showAddAutoname,
  cancelAutoname,
  showEditEntity,
  cancelEditEntity,
  editEntity,
  controlEntity,
} from '@app/core/store/actions/doctype.action';

export interface DoctypeState {
  isShowDoctypegroup: boolean;
  isShowAddDocType: boolean;
  isShowAddAutoname: boolean;
  isShowEditEntity: boolean;

  text: string;
  doctypeGroup: DocTypeGroups;
  indexDoctypegroup: number;
  doctypeGroups: DocTypeGroups[];
  doctype: DocTypes;
  indexDocType: number;

  docEntity: Entity[];
  docEntities: Entity;
  autoName: DocTypes[];
  auto_Name: DocTypes;

  operation: string;
}

export const DoctypeInitialState: DoctypeState = {
  isShowDoctypegroup: false,
  isShowAddDocType: false,
  isShowAddAutoname: false,
  isShowEditEntity: false,
  text: '',
  doctypeGroup: {},
  indexDoctypegroup: 0,
  doctypeGroups: [],
  doctype: {},
  indexDocType: 0,
  operation: '',

  docEntity: [],
  docEntities: {},

  autoName: [],
  auto_Name: {},
};

const doctypeReducer = createReducer(
  DoctypeInitialState,
  on(controlDoctypegroups, (state, { doctypegroups }) => ({
    ...state,
    doctypeGroup: {},
    doctypeGroups: doctypegroups,
  })),

  on(controlDoctypegroup, (state, { doctypegroup, index }) => ({
    ...state,
    isShowDoctypegroup: false,
    indexDoctypegroup: index,
    doctypeGroup: doctypegroup,
    operation: '',
  })),

  on(controlAutoname, (state, { autoname }) => ({
    ...state,
    autoName: autoname,
  })),

  on(controlEntity, (state, { docEntity }) => ({
    ...state,
    docEntity: docEntity,
  })),

  on(controlDoctype, (state, { docType, indexDocType }) => ({
    ...state,
    indexDocType: indexDocType,
    doctype: docType ? { ...docType } : {},
    operation: '',
  })),

  on(addDoctypegroup, (state, { doctypegroup }) => ({
    ...state,
    isShowDoctypegroup: false,
    doctypeGroup: { ...doctypegroup },
    doctypeGroups: [...state.doctypeGroups, doctypegroup],
    operation: '',
    indexDoctypegroup: state.doctypeGroups.length,
  })),

  on(savedDoctypegroup, (state) => ({
    ...state,
    ...saveDoctypegroup(state.doctypeGroups, state.indexDoctypegroup),
    doctypeGroup: {},
  })),

  on(addAutoname, (state, { autoName }) => ({
    ...state,
    // isShowAddAutoname: false,
    ...addInAutoName(state.doctypeGroups, state.indexDoctypegroup, state.indexDocType, autoName),
    operation: '',
  })),

  on(addDoctype, (state, { doctype }) => ({
    ...state,
    isShowAddDocType: false,
    doctype: {},
    ...addInDocType(state.doctypeGroups, state.indexDoctypegroup, doctype),
    operation: '',
  })),

  on(editDoctype, (state, { doctype }) => ({
    ...state,
    isShowAddDocType: false,
    doctype: {},
    ...updateInDoctype(state.doctypeGroups, state.indexDoctypegroup, state.indexDocType, doctype),
    operation: '',
  })),

  on(showDoctypegroup, (state, { operation }) => ({
    ...state,
    isShowDoctypegroup: true,
    operation,
  })),

  on(cancelAddDoctypegroup, (state) => ({
    ...state,
    isShowDoctypegroup: false,
  })),

  on(showAddDocType, (state, { operation }) => ({
    ...state,
    isShowAddDocType: true,
    operation,
  })),

  on(cancelAddDocType, (state) => ({
    ...state,
    isShowAddDocType: false,
  })),

  on(deleteDocType, (state, { indexDocType }) => ({
    ...state,
    ...deleteInDocType(state.doctypeGroups, state.indexDoctypegroup, indexDocType),
    operation: '',
  })),

  on(showAddAutoname, (state, { operation }) => ({
    ...state,
    isShowAddAutoname: true,
    operation,
  })),

  on(cancelAutoname, (state) => ({
    ...state,
    isShowAddAutoname: false,
  })),

  on(showEditEntity, (state, { operation }) => ({
    ...state,
    isShowEditEntity: true,
    operation,
  })),

  on(cancelEditEntity, (state) => ({
    ...state,
    isShowEditEntity: false,
  })),

  on(editEntity, (state, { docEntity }) => ({
    ...state,
    isShowEditEntity: true,
    doctype: {},
    docEntity: [],
    ...addInEditentity(state.doctypeGroups, state.indexDoctypegroup, state.indexDocType, docEntity),
    operation: '',
  })),

  on(editDoctypegroup, (state, { doctypegroup }) => ({
    ...state,
    isShowDoctypegroup: false,
    doctypeGroup: { ...doctypegroup },
    doctypeGroups: updateDoctypeGroup(state.doctypeGroups, state.indexDoctypegroup, doctypegroup),
    operation: '',
  })),

  on(controlDoctypes, (state, { docType, indexDocType, operation }) => ({
    ...state,
    isShowAddDocType: false,
    indexDoctype: indexDocType,
    doctype: docType ? { ...docType } : {},
    operation,
  })),
);

export function DoctypeReducer(state: any, action: any) {
  return doctypeReducer(state, action);
}

function updateDoctypeGroup(doctypeGroups: DocTypeGroups[], indexDoctypegroup: number, doctypeGroup: DocTypeGroups) {
  const doctypeGrupList = JSON.parse(JSON.stringify(doctypeGroups));
  doctypeGrupList[indexDoctypegroup] = doctypeGroup;
  return doctypeGrupList;
}

function addInDocType(doctypeGroups: DocTypeGroups[], indexDoctypegroup: number, doctypes: DocTypes) {
  const doctypegroupList: DocTypeGroups[] = JSON.parse(JSON.stringify(doctypeGroups));
  doctypegroupList[indexDoctypegroup].doctypes = doctypegroupList[indexDoctypegroup].doctypes
    ? doctypegroupList[indexDoctypegroup].doctypes
    : [];
  // @ts-ignore
  doctypegroupList[indexDoctypegroup].doctypes = [...doctypegroupList[indexDoctypegroup].doctypes, doctypes];
  return { doctypeGroups: doctypegroupList, doctypeGroup: doctypegroupList[indexDoctypegroup] };
}

function updateInDoctype(
  doctypeGroups: DocTypeGroups[],
  indexDoctypegroup: number,
  indexDoctype: number,
  doctype: DocTypes,
) {
  const doctypeGrupList = JSON.parse(JSON.stringify(doctypeGroups));
  doctypeGrupList[indexDoctypegroup].doctypes[indexDoctype] = doctype;
  doctypeGrupList[indexDoctypegroup].is_update = !doctypeGrupList[indexDoctypegroup].is_new;
  return { doctypeGroups: doctypeGrupList, doctypeGroup: doctypeGrupList[indexDoctypegroup] };
}

function deleteInDocType(doctypeGroups: DocTypeGroups[], indexDoctypegroup: number, indexDocType: number) {
  const doctypegroupList: DocTypeGroups[] = JSON.parse(JSON.stringify(doctypeGroups));
  // @ts-ignore
  doctypegroupList[indexDoctypegroup].doctypes.splice(indexDocType, 1);
  // doctypegroupList[indexDoctypegroup].is_update = !doctypegroupList[indexDoctypegroup].is_new;
  return { doctypeGroups: doctypegroupList, doctypeGroup: doctypegroupList[indexDoctypegroup] };
}

function addInAutoName(
  doctypeGroups: DocTypeGroups[],
  indexDoctypegroup: number,
  indexAutoName: number,
  autoName: string,
) {
  const doctypeGrupList = JSON.parse(JSON.stringify(doctypeGroups));
  doctypeGrupList[indexDoctypegroup].doctypes[indexAutoName].autoname = autoName;
  doctypeGrupList[indexDoctypegroup].is_update = !doctypeGrupList[indexDoctypegroup].is_new;
  return { doctypeGroups: doctypeGrupList, doctypeGroup: doctypeGrupList[indexDoctypegroup] };
}

function addInEditentity(
  doctypeGroups: DocTypeGroups[],
  indexDoctypegroup: number,
  indexAutoName: number,
  docEntity: DoctypeEntities[],
) {
  const doctypeGrupList: DocTypeGroups[] = JSON.parse(JSON.stringify(doctypeGroups));
  // @ts-ignore
  doctypeGrupList[indexDoctypegroup].doctypes[indexAutoName].doctypes_entities = doctypeGrupList[indexDoctypegroup]
    .doctypes[indexAutoName].doctypes_entities
    ? doctypeGrupList[indexDoctypegroup].doctypes![indexAutoName].doctypes_entities
    : [];
  doctypeGrupList[indexDoctypegroup].doctypes![indexAutoName].doctypes_entities = docEntity;
  const dat = doctypeGrupList[indexDoctypegroup].doctypes![indexAutoName].doctypes_entities;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    doctypeGrupList[indexDoctypegroup].doctypes[indexAutoName].doctypes_entities = null;
  }
  // doctypeGrupList[indexDoctypegroup].is_update = !doctypeGrupList[indexDoctypegroup].is_new;
  return { doctypeGroups: doctypeGrupList, doctypeGroup: doctypeGrupList[indexDoctypegroup] };
}

function saveDoctypegroup(doctypeGroups: DocTypeGroups[], indexDoctypegroup: number) {
  const doctypeGrupList = JSON.parse(JSON.stringify(doctypeGroups));
  doctypeGrupList[indexDoctypegroup].is_new = false;
  doctypeGrupList[indexDoctypegroup].is_update = false;
  return { doctypeGroups: doctypeGrupList, doctypeGroup: doctypeGrupList[indexDoctypegroup] };
}
