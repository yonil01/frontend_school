import { createReducer, on } from '@ngrx/store';
import { Component } from '@app/core/models';
import { controlComponent } from '../actions/component.action';

export interface ComponentState {
  component: Component;
}

export const ComponentInitialState: ComponentState = {
  component: {
    class: '',
    id: '',
    elements: [],
    name: '',
    module_id: '',
    url_front: ''
  },
};

const componentReducer = createReducer(
  ComponentInitialState,

  on(controlComponent, (state, { component }) => ({
    ...state,
    component,
  })),
);

export function ComponentReducer(state: any, action: any) {
  return componentReducer(state, action);
}
