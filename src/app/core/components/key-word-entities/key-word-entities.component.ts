import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Attribute} from '@app/core/models/getDoctypeGroups.model';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {AppState} from '@app/core/store/app.reducers';
import {Store} from '@ngrx/store';
import {take} from 'rxjs/operators';
// import {DatasetsService} from '@app/core/services/graphql/administration/datasets/datasets.service';
import {DropdownModel, ToastService} from "ecapture-ng-ui";
import {dropDownStyle} from "@app/core/utils/static/data";
import {toastDataStyle} from "@app/core/models/toast/toast";
// import {toastDataStyle} from "@app/modules/login/data/style/data.style";

@Component({
  selector: 'app-key-word-entities',
  templateUrl: './key-word-entities.component.html',
  styleUrls: ['./key-word-entities.component.scss'],
})
export class KeyWordEntitiesComponent implements OnInit, OnChanges {
  @Input() keyWordFilter: any;
  @Input() buttonLabel = '';
  @Input() section = '';
  @Output() entitiesSearch = new EventEmitter();

  public readonly toastStyle = toastDataStyle;
  public form: { [key: string]: FormGroup } = {};
  public readonly docTypesDropdown: DropdownModel = dropDownStyle;
  private models: any = {};
  public fields: { [key: string]: any[] } = {};
  public showButton: boolean = false;

  private isValidFormGroup: boolean = false;
  public blockPage: boolean = false;

  public visibilityForm: boolean = false;

  constructor(
    private store: Store<AppState>,
    // private _datasetsService: DatasetsService,
    private _messageService: ToastService
  ) {
  }

  ngOnInit(): void {
  }

  get haveKeyWord() {
    return Object.keys(this.keyWordFilter).length > 0;
  }

  public returnAttributesInfo(): void {
    let entities = [];
    for (const keyEntity of Object.keys(this.form)) {
      if (!this.validateFormAndSection(this.form[keyEntity].valid, this.section)) {
        this.isValidFormGroup = false;
        continue;
      }

      this.isValidFormGroup = true;
      let attributes = Object.keys(this.form[keyEntity].value).map((key) => ({
        name: key,
        value: this.form[keyEntity].value[key]
      }));
      attributes = attributes.filter((att) => att.value);
      if (attributes.length) {
        const entityValue = {
          entity: keyEntity,
          attributes: attributes,
        };
        entities.push(entityValue);
      }
    }
    if (this.isValidFormGroup) {
      this.entitiesSearch.emit(entities);
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos requeridos', life: 5000});
    }
  }

  private validateFormAndSection(formValid: boolean, section: string): boolean {
    return section === 'retrival' ? true : formValid;
  }

  async ngOnChanges(): Promise<void> {
    this.visibilityForm = false;
    if (!this.haveKeyWord) return;
    try {
      this.form = {};
      this.models = {};
      this.fields = {};

      this.keyWordFilter = this.keyWordFilter.map((ent: any) => ent.entities).reduce((acc: any, currentEntity: any) => acc.some((ent1: any) => currentEntity.id === ent1.id) ? acc : [...acc, currentEntity], []);

      this.keyWordFilter = this.keyWordFilter.map((item: any) => ({...item, active: false}));

      this.models = this.keyWordFilter.reduce((acc: any, val: any) => {
        return {
          ...acc,
          [val.name]: val.attributes.reduce((acc1: any, val1: any) => {
            if (val1.entities_attributes_dataset) return {...acc1, [val1.id]: ''};
          }, {}),
        };
      }, {});

      this.fields = await this.keyWordFilter.reduce(async (acc: any, val: any) => {
        return {
          ...(await acc),
          [val.name]: await Promise.all(
            val.attributes.map(async (item: any) => await this.buildElement(item)),
          ),
        };
      }, {});

      this.form = this.keyWordFilter.reduce((acc: any, val: any) => {
        return {...acc, [val.name]: new FormGroup(this.buildFormElementsGroup(this.fields[val.name] || []))};
      }, {});

      this.showButton = true;
      this.visibilityForm = true;
    } catch (e) {
      console.error(e);
    }
  }

  private async buildElement(att: Attribute): Promise<any> {
    switch (att.type) {
      case 'Option':
        let opt = {};
        let type = 'input';
        if (att.entities_attributes_dataset) {
          try {
            this.blockPage = true;
            /*const res = await this.getDataSetValues(att.entities_attributes_dataset.id);
            if (res.data) {
              opt = res.data.map((item: any) => ({value: item.value, label: item.description}));
              type = 'select';
            } else {
              type = 'input';
              opt = {};
            }*/
            this.blockPage = false;
          } catch {
            console.log(Error);
          }
        }
        return {
          key: att.name,
          type: type,
          templateOptions: {
            required: att.required,
            label: att.description,
            placeholder: opt ? 'Selecciona una opción' : att.mask,
            options: opt,
          },
        };
      case 'Datetime':
        return {
          key: att.name,
          type: 'input',
          templateOptions: {
            label: att.description,
            required: att.required,
            type: 'date',
            placeholder: att.mask,
          },
        };
      case 'Date':
        return {
          key: att.name,
          type: 'input',
          templateOptions: {
            label: att.description,
            required: att.required,
            type: 'date',
            placeholder: att.mask,
          },
        };
      default:
        return {
          key: att.name,
          type: 'input',
          templateOptions: {
            type: 'text',
            label: att.description,
            required: att.required,
            placeholder: att.mask,
          },
        };
    }
  }

 /* private getDataSetValues(dataSetID: string): Promise<any> {
    return this._datasetsService.getDatasetsValues(dataSetID.toLowerCase()).pipe(take(1)).toPromise();
  }
*/
  private buildFormElementsGroup(fields: any): any {
    let form = {};
    for (const field of fields) {
      Object.assign(form, {[field.key]: new FormControl('', this.buildFormsValidator(field))});
    }
    return form;
  }

  private buildFormsValidator(itemForm: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (itemForm.templateOptions.required) validators.push(Validators.required);

    return validators;
  }

}
