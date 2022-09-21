import { Entity, Attribute } from '../models/index';

export interface Formly {
  type: string; // form or steps
  orientationSteps?: string;
  steps?: StepType[];
  modelId?: string;
  isUnique?: boolean;
  forms?: any[];
}

export interface StepType {
  label: string;
  formlyList: Formly[];
}

export interface FunctionsDefinition {
  functions?: string[];
  entity?: Entity;
  attribute?: Attribute;
}

export interface FunctionData {
  func?: Function;
  entity?: Entity;
  attribute?: Attribute;
}
