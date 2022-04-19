export interface ModulesPrivileges {
  name: string;
  id: string;
  privileges: Privileges[];
}

export interface Privileges {
  element: any;
  active: boolean;
}

export interface Modulo {
  id: string;
  name: string;
  description: string;
  components: Componente[];
}

export interface ReduxElement {
  id: string;
  element: Elemento;
}

export interface Componente {
  id: string;
  module_id: string;
  name: string;
  description: string;
  url_front: string;
  elements: Elemento[];
}

export interface Elemento {
  id: string;
  name: string;
  description: string;
  url_back: string;
  component_id: string;
  checked: number;
}
