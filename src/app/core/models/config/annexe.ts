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

export interface AnnexeAttributesRequestModel {
  id?: string,
  name?: string,
  doctype_id?: string,
  version?: number,
  is_active?: boolean
}

export interface RequiredDoctypeModel {
  id: string,
  required_id: string,
  doctype_related_id: string,
  is_required: boolean
}

export interface Required {
  id: string,
  name?: string,
  required_doctypes?: RequiredDoctypes[]
  requiredAttributeCommon: RequiredAttributeCommon[]
  version?: number,
  is_active?: boolean
}

export interface RequiredDoctypes {
  id: string,
  doctype_related_id: string,
  is_required: boolean,
  required_attributes: RequiredAttribute
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
  Id: string,
  name: string
}

export interface Preposition {
  Id: string,
  name: string
}

export interface RequiredAttributeCommon {
  id?: string,
  required_id?: string,
  attribute_id?: string
}
