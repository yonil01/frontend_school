import { createReducer, on } from '@ngrx/store';
import {
  Role,
  SecurityEntities,
  SecurityEntity,
  RoleAttribute,
  DateDisallowed,
  PasswordPolicy,
  Elements,
  RolesAllowUser,
  RoleAllowed,
} from '@app/core/models';
import {
  controlRole,
  controlRoles,
  updateRole,
  savedRole,
  deleteRole,
  controlSecurtitys,
  controlSecurityentities,
  cancelAddRole,
  addRole,
  editRole,
  addDatedisallowed,
  updateDatedisallowed,
  deleteDatedisallowed,
  addPasswordPolicy,
  addElement,
  deleteRoleElement,
  addSecurityEntities,
  updateAtrribute,
  deleteAtrribute,
  addDoctype,
  deletePasswordPolicy,
  showRole,
  showAtribRole,
  deleteSecurity,
  addRoleAllow,
  deleteRoleAllow,
  deleteRoleDocType,
  controlDatedisallowed,
} from '@app/core/store/actions/roles.action';
import { editSecurity } from '../actions/roles.action';

export interface RoleState {
  isDisplayModal: boolean;
  isEnabledTab: boolean;
  role: Role;
  securitis: SecurityEntities[];
  security: SecurityEntities;
  roles: Role[];
  securityEntities: SecurityEntities[];
  indexRole: number;
  indexSecurityE: number;
  indexRoleAtribu: number;
  indexDate: number;
  indexRoleDoctype: number;
  indexRoleAllow: number;
  indexRoleElement: number;
  operation: string;
}

export const RoleInitialState: RoleState = {
  isDisplayModal: false,
  isEnabledTab: false,
  role: {},
  security: {},
  securityEntities: [],
  roles: [],
  securitis: [],
  indexRole: 0,
  indexSecurityE: 0,
  indexRoleAtribu: 0,
  indexDate: 0,
  indexRoleDoctype: 0,
  indexRoleElement: 0,
  indexRoleAllow: 0,
  operation: '',
};

const roleReducer = createReducer(
  RoleInitialState,

  on(showRole, (state, { operation }) => ({
    ...state,
    isDisplayModal: true,
    operation,
  })),

  on(showAtribRole, (state, { operation }) => ({
    ...state,
    isEnabledTab: true,
    operation,
  })),

  on(cancelAddRole, (state) => ({
    ...state,
    isDisplayModal: false,
  })),

  on(controlRoles, (state, { roles }) => ({
    ...state,
    role: {},
    roles: roles,
  })),

  on(controlSecurtitys, (state, { security }) => ({
    ...state,
    securitis: security,
  })),

  on(controlSecurityentities, (state, { index }) => ({
    ...state,
    indexSecurityE: index,
  })),

  on(controlDatedisallowed, (state, { index }) => ({
    ...state,
    indexDate: index,
  })),

  on(controlRole, (state, { role, index }) => ({
    ...state,
    indexRole: index,
    role,
    operation: '',
  })),

  on(savedRole, (state) => ({
    ...state,
    ...saveRole(state.roles, state.indexRole),
  })),

  on(updateRole, (state, { role }) => ({
    ...state,
    role: { ...role },
  })),

  // on(updateSecurityEntities, (state, { securityEntities }) => ({
  //   ...state,
  //   securityEntities : { ...securityEntities },
  //   role : { ...state.role,  security_entities: securityEntities },
  // })),

  on(addRole, (state, { role }) => ({
    ...state,
    role: { ...role },
    roles: [...state.roles, role],
    indexRole: state.roles.length,
    isDisplayModal: false,
  })),

  on(editRole, (state, { role }) => ({
    ...state,
    isDisplayModal: false,
    role: { ...role },
    roles: updateRoles(state.roles, state.indexRole, role),
    operation: '',
  })),

  on(deleteRole, (state, { indexRole }) => ({
    ...state,
    ...deleteInRole(state.roles, indexRole),
    operation: '',
    role: {},
  })),

  on(addDatedisallowed, (state, { datedisallowed }) => ({
    ...state,
    ...addInDatedisallowed(state.roles, state.indexRole, datedisallowed),
  })),

  on(updateDatedisallowed, (state, { datedisallowed }) => ({
    ...state,
    ...updateInDatedisallowed(state.roles, state.indexRole, state.indexDate, datedisallowed),
  })),

  on(deleteDatedisallowed, (state, { index }) => ({
    ...state,
    ...deleteInDatedisallowed(state.roles, state.indexRole, index),
    operation: '',
  })),

  on(addPasswordPolicy, (state, { passwordpolicy }) => ({
    ...state,
    ...addInPasswordPolicy(state.roles, state.indexRole, passwordpolicy),
  })),

  on(deletePasswordPolicy, (state) => ({
    ...state,
    ...deletePassword(state.roles, state.indexRole),
    operation: '',
  })),

  on(addElement, (state, { element }) => ({
    ...state,
    ...addInElement(state.roles, state.indexRole, element),
  })),

  on(deleteRoleElement, (state, { indexRoleElement }) => ({
    ...state,
    ...deleteInElement(state.roles, state.indexRole, indexRoleElement),
    operation: '',
  })),

  on(addSecurityEntities, (state, { securityEntities }) => ({
    ...state,
    ...addInSecurityEntities(state.roles, state.indexRole, securityEntities),
  })),

  on(editSecurity, (state, { securityEntities }) => ({
    ...state,
    // isShowAttribute: false,
    securityEntities: [],
    ...updateSecurityEntities(state.roles, state.indexRole, state.indexSecurityE, securityEntities),
    operation: '',
  })),

  on(updateAtrribute, (state, { attribute, indexRoleAtribu }) => ({
    ...state,
    // isShowAttribute: false,
    securityEntities: [],
    ...updateAttributeEntities(state.roles, state.indexRole, state.indexSecurityE, indexRoleAtribu, attribute),
    operation: '',
  })),

  on(deleteAtrribute, (state, { indexRoleAtribu }) => ({
    ...state,
    ...deleteAttributeEntities(state.roles, state.indexRole, state.indexSecurityE, indexRoleAtribu),
    operation: '',
  })),

  on(deleteSecurity, (state, { index }) => ({
    ...state,
    ...deleteSecurityEntities(state.roles, state.indexRole, index),
    operation: '',
  })),

  on(addDoctype, (state, { doctype }) => ({
    ...state,
    ...addInDoctype(state.roles, state.indexRole, doctype),
  })),

  on(deleteRoleDocType, (state, { indexRoleDocType }) => ({
    ...state,
    ...deleteInRoleDocType(state.roles, state.indexRole, indexRoleDocType),
    operation: '',
  })),

  on(addRoleAllow, (state, { rolleallow }) => ({
    ...state,
    ...addRoleallow(state.roles, state.indexRole, rolleallow),
  })),

  on(deleteRoleAllow, (state, { indexRoleAllow }) => ({
    ...state,
    ...deleteInRoleAllow(state.roles, state.indexRole, indexRoleAllow),
    operation: '',
  })),
);

export function RoleReducer(state: any, action: any) {
  return roleReducer(state, action);
}

function updateRoles(roles: Role[], indexRole: number, role: Role) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole] = role;
  return roleList;
}

// Guardar roles
function saveRole(roles: Role[], indexRole: number) {
  const roleList = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].is_new = false;
  roleList[indexRole].is_update = false;
  return { roles: roleList, role: roleList[indexRole] };
}

function deleteInRole(roles: Role[], indexRole: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList.splice(indexRole, 1);
  return { roles: roleList };
}

// Agregar Date_Disallowed
function addInDatedisallowed(roles: Role[], indexRole: number, datedisallowed: DateDisallowed) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].date_disallowed = roleList[indexRole].date_disallowed ? roleList[indexRole].date_disallowed : [];
  // @ts-ignore
  roleList[indexRole].date_disallowed = [...roleList[indexRole].date_disallowed, datedisallowed];
  return { roles: roleList, role: roleList[indexRole] };
}

function updateInDatedisallowed(roles: Role[], indexRole: number, indexDate: number, datedisallowed: DateDisallowed) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].date_disallowed = roleList[indexRole].date_disallowed ? roleList[indexRole].date_disallowed : [];
  // @ts-ignore
  roleList[indexRole].date_disallowed[indexDate] = datedisallowed;
  return { roles: roleList, role: roleList[indexRole] };
}

function deleteInDatedisallowed(roles: Role[], indexRole: number, index: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].date_disallowed.splice(index, 1);
  const dat = roleList[indexRole].date_disallowed;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    roleList[indexRole].date_disallowed = null;
  }
  return { roles: roleList, role: roleList[indexRole] };
}

// Agregar politicas de Seguridad - PasswordPolicy
function addInPasswordPolicy(roles: Role[], indexRole: number, passwordpolicy: PasswordPolicy) {
  const roleList = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].password_policy = passwordpolicy;
  return { roles: roleList, role: roleList[indexRole] };
}

// Agregar politicas de Seguridad - PasswordPolicy
function addInElement(roles: Role[], indexRole: number, element: Elements) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].role_elements = roleList[indexRole].role_elements ? roleList[indexRole].role_elements : [];
  // @ts-ignore
  roleList[indexRole].role_elements = [...roleList[indexRole].role_elements, element];
  return { roles: roleList, role: roleList[indexRole] };
}

function deleteInElement(roles: Role[], indexRole: number, indexRoleElement: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].role_elements.splice(indexRoleElement, 1);
  const dat = roleList[indexRole].role_elements;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    roleList[indexRole].role_elements = null;
  }
  // doctypegroupList[indexDoctypegroup].is_update = !doctypegroupList[indexDoctypegroup].is_new;
  return { roles: roleList, role: roleList[indexRole] };
}

// Eliminar Paswword Policy
function deletePassword(roles: Role[], indexRole: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].password_policy = null;
  return { roles: roleList, role: roleList[indexRole] };
}

// Agregar Entidades de Se
function addInSecurityEntities(roles: Role[], indexRole: number, securityentities: SecurityEntity) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].security_entities = roleList[indexRole].security_entities
    ? roleList[indexRole].security_entities
    : [];
  // @ts-ignore
  roleList[indexRole].security_entities = [...roleList[indexRole].security_entities, securityentities];
  return { roles: roleList, role: roleList[indexRole] };
}

// Actualizar security
function updateSecurityEntities(roles: Role[], indexRole: number, indexSecurityE: number, attrEntities: RoleAttribute) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].security_entities[indexSecurityE].role_attribute = roleList[indexRole].security_entities[
    indexSecurityE
  ].role_attribute
    ?  roleList[indexRole].security_entities![indexSecurityE].role_attribute
    : [];
  // @ts-ignore
  roleList[indexRole].security_entities[indexSecurityE].role_attribute = [
    ...roleList[indexRole].security_entities![indexSecurityE].role_attribute!,
    attrEntities,
  ];
  return { roles: roleList, role: roleList[indexRole] };
}

function updateAttributeEntities(
  roles: Role[],
  indexRole: number,
  indexSecurityE: number,
  indexRoleAtribu: number,
  attrEntities: RoleAttribute,
) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].security_entities[indexSecurityE].role_attribute[indexRoleAtribu] = attrEntities;
  return { roles: roleList, role: roleList[indexRole] };
}

function deleteAttributeEntities(roles: Role[], indexRole: number, indexSecurityE: number, indexRoleAtribu: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].security_entities[indexSecurityE].role_attribute.splice(indexRoleAtribu, 1);
  // @ts-ignore
  const dat = roleList[indexRole].security_entities[indexSecurityE].role_attribute;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    roleList[indexRole].security_entities[indexSecurityE].role_attribute = null;
  }
  return { roles: roleList, role: roleList[indexRole] };
}
// Eliminar Security
function deleteSecurityEntities(roles: Role[], indexRole: number, indexSecurityE: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].security_entities.splice(indexSecurityE, 1);
  const dat = roleList[indexRole].security_entities;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    roleList[indexRole].security_entities = null;
  }
  return { roles: roleList, role: roleList[indexRole] };
}

// Agregar doctypes
function addInDoctype(roles: Role[], indexRole: number, doctype: RolesAllowUser[]) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].roles_doc_types = roleList[indexRole].roles_doc_types ? roleList[indexRole].roles_doc_types : [];
  roleList[indexRole].roles_doc_types = doctype;
  return { roles: roleList, role: roleList[indexRole] };
}

// Eliminar Doctypes
function deleteInRoleDocType(roles: Role[], indexRole: number, indexRoleDocType: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].roles_doc_types.splice(indexRoleDocType, 1);
  const dat = roleList[indexRole].roles_doc_types;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    roleList[indexRole].roles_doc_types = null;
  }
  return { roles: roleList, role: roleList[indexRole] };
}

//  RolleAllow
function addRoleallow(roles: Role[], indexRole: number, roleallow: RoleAllowed[]) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  roleList[indexRole].role_allow = roleList[indexRole].role_allow ? roleList[indexRole].role_allow : [];
  roleList[indexRole].role_allow = roleallow;
  return { roles: roleList, role: roleList[indexRole] };
}

function deleteInRoleAllow(roles: Role[], indexRole: number, indexRoleAllow: number) {
  const roleList: Role[] = JSON.parse(JSON.stringify(roles));
  // @ts-ignore
  roleList[indexRole].role_allow.splice(indexRoleAllow, 1);
  const dat = roleList[indexRole].role_allow;
  // @ts-ignore
  if (dat.length === 0) {
    // @ts-ignore
    roleList[indexRole].role_allow = null;
  }
  return { roles: roleList, role: roleList[indexRole] };
}
