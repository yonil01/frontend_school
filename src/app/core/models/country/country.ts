export interface CountryModel {
  country: string;
  departments: DepartmentsModel[];
}

export interface DepartmentsModel {
  department: string;
  cities: CityModel[];
}

export interface CityModel {
  city: string;
}
