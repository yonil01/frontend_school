export interface Module {
  id?: string;
  name?: string;
  description?: string;
  class?: string;
  components?: Component[];
  created_at?: Date;
  updated_at?: Date;
}

export interface Component {
  id: string;
  name?: string;
  url_front?: string;
  class?: string;
  module_id: string;
  elements?: Element[];
}

export interface Element {
  id: string;
  name?: string;
  description?: string;
  url_back?: string;
  component_id?: string;
  active?: boolean;
}
