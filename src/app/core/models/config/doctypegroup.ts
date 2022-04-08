import { Entity } from './entity';
import {Project} from "@app/core/models";

export interface DocTypeGroups {
  id?: string;
  project?: Project;
  project_id?: string;
  name?: string;
  doctypes?: DocTypes[];
}

export interface DocTypesDisplay {
  active: boolean;
  docType: DocTypes;
}

export interface DocTypes {
  id?: string;
  code?: string;
  name?: string;
  url_path?: string;
  storage_id?: string;
  format?: string;
  autoname?: string;
  procedure?: string;
  tipo_soporte?: string;
  retencion_electronic?: number;
  retencion_ag?: number;
  retencion_ac?: number;
  retencion_ah?: number;
  final_disposition?: string;
  digitalizacion?: boolean;
  class?: string;
  is_cipher?: boolean;
  doctypes_entities?: DoctypeEntities[];
  doctypes_groups_id?: string;
}

export interface DoctypeEntities {
  id?: string;
  doctypes_id?: string;
  entities_id?: string;
  entities?: Entity;
  sequence?: number;
}

export interface EntitiesAttributesDataset {
  id?: string;
  description?: string;
  name?: string;
}
