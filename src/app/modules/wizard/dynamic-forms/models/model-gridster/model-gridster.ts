import { GridsterItem, GridsterConfig, Draggable, Resizable, PushDirections } from 'angular-gridster2';
import { FormlyFieldConfig } from '@ngx-formly/core';

export interface Form {
  doctype?: string;
  type?: string; // step, tab, normal
  containers?: Container[];
}

export interface Container {
  name?: string;
  type?: string; // step, tab, normal
  dashboards?: Dashboard[];
}

export interface Dashboard {
  gridsterItems?: GridsterItem[];
  options?: Safe;
  entity?: Entity;
  gridster?: GridsterItem;
}

export interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

export interface Formly {
  type: string; // form or steps
  orientationSteps?: string;
  steps?: StepType[];
  modelId?: string;
  isUnique?: boolean;
  forms?: FormlyFieldConfig[];
}

export interface StepType {
  label: string;
  formlyList: Formly[];
}

export interface FunctionsDefinition {
  functions?: string[];
  entity?: Entity;
  attribute?: Attribute;
}

export interface FunctionData {
  func?: Function;
  entity?: Entity;
  attribute?: Attribute;
}

export interface Entity {
  id?: string;
  name?: string;
  project?: Project;
  project_id?: string;
  is_unique?: boolean;
  attributes?: Attribute[];
}

export interface Attribute {
  id?: string;
  name?: string;
  description?: string;
  tag_html?: string;
  type?: string;
  mask?: string;
  autofill?: string[];
  min_length?: number;
  max_length?: number;
  validation?: string;
  field_types?: string;
  sequence?: number;
  regex?: string;
  dataset?: boolean;
  is_cipher?: boolean;
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  is_index?: boolean;
  entities_id?: string;
  entities_attributes_dataset?: Dataset;
  entities_attributes_autofills?: AttributeAutofill;
  entities_attributes_cascading_dataset?: AttributeCascadingDataset;
  cascading_datasets?: string[];
  autofill_attributes?: number[];
}

export interface Project {
  id?: string;
  name?: string;
  description?: String;
  department?: String;
  email?: String;
  phone?: String;
  product_owner?: String;
  customers_id?: string;
}

export interface Dataset {
  id?: string;
  name?: string;
  description?: string;
  field_type?: string;
  max_length?: number;
  outside?: boolean;
  process?: string;
}

export interface AttributeAutofill {
  id?: string;
  autofills_id?: string;
  autofills?: Autofill;
  attributes_id?: string;
  attribute?: Attribute;
  sequence?: number;
  is_search?: boolean;
}

export interface AttributeCascadingDataset {
  id?: string;
  cascading_dataset?: CascadingDataset;
  attribute?: Attribute;
  sequence?: number;
}

export interface CascadingDataset {
  id?: string;
  name?: string;
  description?: string;
  outside?: boolean;
  process?: string;
  entities_id?: string;
}

export interface Autofill {
  id?: string;
  name?: string;
  description?: string;
  outside?: boolean;
  process?: string;
  entities_id?: string;
}
