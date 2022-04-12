
export interface StepModel {
  style?: {
    background?: string,
    border?: string,
    size?: string,
  }
  dataSourceStep: DataStep[]
}

export interface DataStep {
  index: number,
  title: string,
  status: string
  block: boolean;
  focus:boolean;
}
