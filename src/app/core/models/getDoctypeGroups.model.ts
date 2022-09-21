import { Project } from './config/customer';

export interface GetDoctypeGroups {
  getDoctypeGroups?: GetDoctypeGroupsClass;
}

export interface GetDoctypeGroupsClass {
  error?: boolean;
  data?: Datum[];
  code?: number;
  type?: string;
  msg?: string;
}

export interface Datum {
  id?: string;
  project?: string;
  doc_types?: DocType[];
}

export interface DocType {
  id?: string;
  code?: number;
  name?: string;
  url_path?: string;
  storage?: string;
  format?: string;
  auto_name?: string;
  type_support?: string;
  retention_electronic?: number;
  retention_ag?: number;
  retention_ac?: number;
  retention_ah?: number;
  final_disposition?: string;
  digitalization?: boolean;
  procedure?: string;
  class?: string;
  is_cipher?: boolean;
  entities?: Entity[];
}

export interface Entity {
  id?: string;
  name?: string;
  project?: Project;
  is_unique?: boolean;
  attributes?: Attribute[];
}

export interface EntitiesMultipleDisplay {
  display: boolean;
  entity: Entity;
}

export interface Attribute {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  mask?: string;
  required: boolean;
  entities_attributes_dataset?: {
    id: string;
    description: string;
    sequence: number;
    value: string;
  };
}
