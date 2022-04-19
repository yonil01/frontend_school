import {Attribute} from "@app/modules/wizard/entidades/models/entities.models";

export interface Autofill {
  id?: string;
  name?: string;
  description?: string;
  outside?: boolean;
  process?: string;
  entities_id?: string;
}

export interface AutofillValue {
  id?: number;
  code?: number;
  sequence?: number;
  value?: string;
  description?: string;
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

// export interface AttributeAutofillResponse {
//   id?: string;
//   autofills?: Autofill;
//   attribute?: Attribute;
//   sequence?: number;
// }

export interface AutofillsValues {
  autofill_id?: string;
  autofill_values?: any;
}
