import { GridsterItem, GridsterConfig, Draggable, Resizable, PushDirections } from 'angular-gridster2';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {Attribute, Entity} from "@app/core/models";

export interface Form {
  doctype?: string;
  type?: string; // step, tab, normal
  containers?: Container[];
}

export interface Container {
  name?: string;
  type?: string; // step, tab, normal
  dashboards?: Dashboard[];
}

export interface Dashboard {
  gridsterItems?: GridsterItem[];
  options?: Safe;
  entity?: Entity;
  gridster?: GridsterItem;
}

export interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

export interface Formly {
  type: string; // form or steps
  orientationSteps?: string;
  steps?: StepType[];
  modelId?: string;
  isUnique?: boolean;
  forms?: FormlyFieldConfig[];
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
