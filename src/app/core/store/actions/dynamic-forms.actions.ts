/*import { createAction, props } from '@ngrx/store';
import { GridsterItem } from 'angular-gridster2';
import { DocTypes } from 'core/models';
import { Form, StepType, Formly } from 'core/models/config/form';
import { Container } from 'core/models/config/form';
import { Dashboard } from 'core/models/config/form';
import { FormlyFieldConfig } from '@ngx-formly/core';

export const controlDashboard = createAction(
  '[dynamic-forms] load Dashboard',
  props<{ dashboard: Array<GridsterItem> }>(),
);

export const addGridsterItem = createAction(
  '[dynamic-forms] add GridsterItem',
  props<{ gridsterItem: GridsterItem; indexContainer: number; indexDashboard: number }>(),
);

export const deleteGridsterItem = createAction('[dynamic-forms] delete GridsterItem', props<{ indexItem: number }>());

export const editGridsterItem = createAction(
  '[dynamic-forms] edit GridsterItem',
  props<{ gridsterItem: GridsterItem }>(),
);

export const controlGridsterItem = createAction(
  '[dynamic-forms] load GridsterItem',
  props<{ index: number; gridsterItem: GridsterItem }>(),
);

export const controlFormDoctype = createAction('[dynamic-forms] load formDoctype', props<{ formDoctype: DocTypes }>());

export const controlEForm = createAction('[dynamic-forms] load EForm', props<{ eform: Form }>());

export const addContainer = createAction('[dynamic-forms] add contaner', props<{ container: Container }>());

export const deleteContainer = createAction('[dynamic-forms] delete contaner', props<{ indexContainer: number }>());

export const editContainer = createAction(
  '[dynamic-forms] edit contaner',
  props<{ container: Container; indexContainer: number }>(),
);

export const addDashboard = createAction(
  '[dynamic-forms] add Dashboard',
  props<{ dashboard: Dashboard; indexContainer: number }>(),
);

export const editDashboard = createAction('[dynamic-forms] edit Dashboard', props<{ dashboard: Dashboard }>());

export const deleteDashboard = createAction('[dynamic-forms] delete Dashboard', props<{ indexDashboard: number }>());

export const controlJsonForm = createAction(
  '[dynamic-forms] add load json form',
  props<{ jsonForm: Formly[]; models: {} }>(),
);

export const controlJsonStepForm = createAction(
  '[dynamic-forms] add load json step form',
  props<{ jsonStepForm: StepType[] }>(),
);

export const editIndexContainer = createAction(
  '[dynamic-forms] editIndexContainer',
  props<{ indexContainer: number }>(),
);

export const editIndexDashboard = createAction(
  '[dynamic-forms] editIndexDashboard',
  props<{ indexDashboard: number }>(),
);

export const editIndexGridsterItem = createAction(
  '[dynamic-forms] editIndexGridsterItem',
  props<{ indexGridsterItem: number }>(),
);

export const controlDocumentId = createAction('[dynamic-forms] control documentId', props<{ documentId: string }>());

export const resetStoreDynamicForms = createAction('[dynamic-forms] resetStoreDynamicForms');
*/
