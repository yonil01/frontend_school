import { Project, Dataset, AttributeAutofill } from '../models/index';

export interface Entity {
  id?: string;
  name?: string;
  project?: Project;
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

export interface AttributeDataset {
  id?: string;
  dataset_id?: string;
  attributes_id?: string;
}

export interface AutoFill {
  name?: string;
  description?: string;
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

