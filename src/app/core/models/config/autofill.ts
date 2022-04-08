import {Attribute} from "@app/core/models";

export interface Autofill {
  id?: string;
  name?: string;
  description?: string;
  outside?: boolean;
  process?: string;
  entities_id?: string;
  showConfig?: boolean;
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

export interface ResponseGetAttributesAutofill {
  id:        string;
  autofills: AutofillsResponse;
  attribute: AttributeResponse;
  sequence:  number;
}

export interface AttributeResponse {
  id:                          string;
  name:                        string;
  description:                 string;
  tag_html:                    string;
  type:                        string;
  mask:                        string;
  min_length:                  number;
  max_length:                  number;
  validation:                  string;
  field_types:                 string;
  dataset:                     boolean;
  is_cipher:                   boolean;
  required:                    boolean;
  hidden:                      boolean;
  disabled:                    boolean;
  entities_id:                 string;
  is_index:                    boolean;
  sequence:                    number;
  entities_attributes_dataset: null;
}

export interface AutofillsResponse {
  id:   string;
  name: string;
}
export interface ResponseGetValuesAtributtesAutofill {
  created_at:    Date;
  id:            number;
  inputdate:     Date;
  inputnumber:   number;
  inputonlytext: string;
  inputtext:     string;
  updated_at:    Date;
}

