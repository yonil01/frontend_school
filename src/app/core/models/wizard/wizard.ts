export interface Client {
  id:       string;
  name:     string;
  nit:      number;
  country:  string;
  city:     string;
  address:  string;
  phone:    string;
  email:    string;
  projects: Project[];
}

export interface Project {
  id:            string;
  name:          string;
  description:   string;
  department:    string;
  email:         string;
  phone:         string;
  product_owner: string;
  customers_id:  string;
}
