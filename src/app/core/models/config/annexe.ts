export interface NewRequired {
  id: string,
  name: string,
  doctype_id: string,
  version: boolean,
  is_active: boolean
}

export interface Required {
  id?: string,
  name: string,
  required_doctypes?: RequiredDoctypes[]
  version: number,
  is_active: boolean
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
