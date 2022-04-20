import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
// models
import {Activity, Attribute, DocTypes, Entity, Param, ParamActivity, Process, Role, Rule} from '@app/core/models';
// Store
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {map, startWith} from 'rxjs/operators';
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActivityFormComponent implements OnInit {
  @Input() roles: Role[] = [];
  @Input() docTypes: DocTypes[] = [];
  @Input() activities: Activity[] = [];
  @Input() isCreate: boolean = false;
  @Input() rule!: Rule;
  @Input() entities: Entity[] = [];
  @Output() ruleSaved = new EventEmitter<Rule>();

  public readonly dropStyle: DropdownModel = dropStyle;

  public form!: FormGroup;
  model = {};
  public fields: any[] = [];
  public statusOptions: any[] = [];
  public activityOptions: any[] = [];
  private entity: string = '';
  private attributes: Attribute[] = [];

  private bpm!: Process;

  constructor(private store: Store<AppState>) {
    this.fields = [];
    this.store.select('bpm').subscribe((res) => (this.bpm = res.bpm));
  }

  async ngOnInit() {
    this.statusOptions = [
      {label: 'Activo', value: true},
      {label: 'Inactivo', value: false},
    ];
    this.activityOptions = this.activities.map((act) => ({label: act.name, value: act.name}));
    if (this.isCreate) {
      this.form = new FormGroup({
        id: new FormControl(0),
        name: new FormControl(null, Validators.required),
        activity: new FormControl(null, Validators.required),
        status: new FormControl(true, Validators.required),
      });
    } else {
      const activity = this.activities.find((act) => act.name === this.rule.action);
      this.form = new FormGroup({
        id: new FormControl(this.rule.id),
        name: new FormControl(this.rule.name, Validators.required),
        activity: new FormControl(this.rule.action, Validators.required),
        status: new FormControl(this.rule.status, Validators.required),
      });
      if (activity) {
        this.fields = [];
        this.model = {};
        activity.parameters?.forEach((p: ParamActivity) => {
          const parameter = this.rule.rule_params?.find((param) => param.name === p.name);
          const field = this.buildFormLyObject(p, parameter?.value);
          this.form.addControl(field.key, new FormControl(field.defaultValue ? field.defaultValue : '', this.buildValidators(field)));
          this.fields.push(field);
        });
      }
    }
  }

  get getForm() {
    return this.form;
  }

  public buildParameters(event: any): void {
    this.fields = [];
    this.model = {};
    const activity = this.activities.find((act) => act.name === event);
    if (activity) {
      activity?.parameters?.forEach((p: ParamActivity) => {
        const field = this.buildFormLyObject(p);
        this.form.addControl(field.key, new FormControl(field.defaultValue ? field.defaultValue : '', this.buildValidators(field)));
        this.fields.push(field);
      });
    }
  }

  private buildFormLyObject(obj: ParamActivity, value?: string): any {
    let list;
    let objFormLy: {};
    switch (obj.list) {
      case 'queues':
        list = this.bpm.queues?.map((q) => ({value: q.id.toLowerCase(), label: q.name}));
        objFormLy = {
          key: obj.name,
          className: 'row-input',
          type: obj.type,
          defaultValue: value ? value : null,
          templateOptions: {
            label: obj.name,
            placeholder: obj.label,
            required: true,
            options: obj.type === 'select' ? list : null,
          },
        };
        break;
      case 'roles':
        list = this.roles.map((r) => ({value: r.id?.toLowerCase(), label: r.name}));
        objFormLy = {
          key: obj.name,
          className: 'row-input',
          type: obj.type,
          defaultValue: value ? value : null,
          templateOptions: {
            label: obj.name,
            placeholder: obj.label,
            required: true,
            options: obj.type === 'select' ? list : null,
          },
        };
        break;
      case 'doctypes':
        list = this.docTypes.map((d) => ({value: d.id?.toLowerCase(), label: d.name}));
        objFormLy = {
          key: obj.name,
          className: 'row-input',
          type: obj.type,
          defaultValue: value ? value : null,
          templateOptions: {
            label: obj.name,
            placeholder: obj.label,
            required: true,
            options: obj.type === 'select' ? list : null,
          },
        };
        break;
      case 'entities':
        list = this.entities.map((d) => ({value: d.id?.toLowerCase(), label: d.name}));
        objFormLy = {
          key: obj.name,
          className: 'row-input',
          type: obj.type,
          defaultValue: value ? value : null,
          templateOptions: {
            label: obj.name,
            placeholder: obj.label,
            required: true,
            options: obj.type === 'select' ? list : null,
          },
        };
        this.entity = value || '';
        break;
      case 'entity-attributes':
        list = this.entities.map((d) => ({value: d.id?.toLowerCase(), label: d.name}));
        objFormLy = {
          key: obj.name,
          className: 'row-input',
          type: 'select',
          defaultValue: value ? value : null,
          templateOptions: {
            label: obj.name,
            placeholder: obj.label,
            required: true,
            options: [],
          },
          hooks: {
            onInit: (field: any) => {
              field.templateOptions.options = field.form.get('entity').valueChanges.pipe(
                startWith(this.entity),
                map((entityId: any) => {
                  if (entityId) {
                    this.attributes = this.entities.find((e) => e.id?.toLowerCase() === entityId.toLowerCase())?.attributes || [];
                    const att: any[] = this.attributes.map((a) => ({value: a.id.toLowerCase(), label: a.name}));
                    return att;
                  } else {
                    return [];
                  }
                }),
              );
              field.templateOptions.options.subscribe();
            },
          },
        };
        break;
      default:
        if (obj.name === 'value') {
          objFormLy = {
            key: obj.name,
            className: 'row-input',
            // type: obj.type,
            type: 'input',
            defaultValue: value ? value : null,
            templateOptions: {
              type: 'text',
              label: obj.name,
              placeholder: obj.label,
              required: true,
              // options: obj.type === 'select' ? list : null,
            },
            hooks: {
              onInit: (field: any) => {
                const obs = field.form.get('attribute').valueChanges.pipe(
                  startWith(''),
                  map(() => {
                    // if (attributeId && this.attributes?.length) {
                    //   const attribute = this.attributes.find((a) => a.id.toLowerCase() === attributeId.toLowerCase());
                    //   field.templateOptions.type = attribute.type.toLowerCase();
                    // } else {
                    //   field.templateOptions.type = 'text';
                    // }
                  }),
                );

                obs.subscribe();
              },
            },
          };
        } else {
          objFormLy = {
            key: obj.name,
            className: 'row-input',
            type: obj.type,
            defaultValue: value ? value : null,
            templateOptions: {
              label: obj.name,
              placeholder: obj.label,
              required: true,
              options: obj.type === 'select' ? list : null,
            },
          };
        }
    }
    return objFormLy;
  }

  getAttributesByEntity(entityId: string): any[] {
    if (entityId) {
      const attributes = this.entities.find((e) => e.id?.toLowerCase() === entityId.toLowerCase())?.attributes;
      return attributes?.map((a) => ({value: a.id.toLowerCase(), label: a.name})) || [];
    } else {
      return [];
    }
  }

  public save(): void {
    if (this.form.valid) {
      const valuesForm = this.form.controls;
      const paramsList: {name: string, value: string}[] = [];
      for (const valuesFormKey in valuesForm) {
        if (valuesFormKey !== 'activity' && valuesFormKey !== 'name' && valuesFormKey !== 'status') {
          paramsList.push({name: valuesFormKey, value: valuesForm[valuesFormKey].value});
        }
      }
      if (this.isCreate) {
        const rule: Rule = {
          code: 0, description: "", execution_id: "", rule_params: [],
          name: this.form.value.name,
          first: 0,
          child_true: 0,
          child_false: 0,
          itemtype_id: 0,
          params: paramsList,
          action: this.form.value.activity,
          status: this.form.value.status
        };
        console.log(rule);
        this.ruleSaved.emit(rule);
      } else {
        const rule: Rule = {
          ...this.rule,
          name: this.form.value.name,
          params: paramsList,
          action: this.form.value.activity,
          status: this.form.value.status,
        };
        this.ruleSaved.emit(rule);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  private buildValidators(field: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.templateOptions.required) {
      validators.push(Validators.required);
    }
    return validators;
  }
}
