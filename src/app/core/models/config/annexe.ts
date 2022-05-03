export interface AnnexeRequestModel {
  id?: string,
  name?: string,
  doctype_id?: string,
  version?: number,
  is_active?: boolean
}

export interface AnnexeDoctypesRequestModel {
  id: string,
  required_id: string,
  doctype_related_id: string,
  is_required: boolean
}

export interface RequiredAttributeRequestModel {
  id: string,
  required_doctype_id: string,
  entity_id: string,
  attribute_id: string,
  comparison_symbol_id: number,
  value: string,
  preposition_id: number
}

export interface RequiredAttributeCommonRequestModel {
  id: string,
  required_id: string,
  attribute_id: string
}

export interface Required {
  id: string,
  name?: string,
  required_doctypes?: RequiredDoctypes[]
  required_attributes_common?: RequiredAttributeCommon[]
  version?: number,
  is_active?: boolean
}

export interface RequiredDoctypes {
  id: string,
  doctype_related_id: string,
  is_required: boolean,
  required_attributes: RequiredAttribute[]
}

export interface RequiredAttribute {
  id: string,
  entity_id: string,
  attribute_id: string,
  comparison_symbol: ComparisonSymbol
  value: string,
  preposition: Preposition
}

export interface ComparisonSymbol {
  Id: number,
  name: string
}

export interface Preposition {
  Id: number,
  name: string
}

export interface RequiredAttributeCommon {
  id?: string,
  required_id?: string,
  attribute_id?: string
}

export interface DoctypeConfig {
  id: string,
  name?: string,
  doctype_required_id: string,
  is_required?: boolean,
  is_related?: boolean,
  SHOW: boolean
}

export interface AttributeCommonConfig {
  id: string,
  name?: string,
  required_id?: string,
  attribute_common_id: string,
  is_common?: boolean,
  SHOW: boolean
}
