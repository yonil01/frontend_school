import {Injectable} from '@angular/core';
import {FunctionsDefinition} from "@app/core/models/config/form";
import {Attribute, Entity} from "@app/core/models";
import {
  FormlyFunctionsService
} from "@app/core/components/dynamic-form-viewer/services/formly-functions/formly-functions.service";

@Injectable({
  providedIn: 'root',
})
export class FieldsFormlyService {
  constructor(private formlyFunctionsService: FormlyFunctionsService) {}

  getFormyFieldsByEntity(entity: any): any[] {
    let formlyFields: any[] = [
      {
        fieldGroupClassName: 'grid',
        fieldGroup: [],
      },
    ];
    if (entity.attributes) {
      for (const attribute of entity.attributes) {
        formlyFields[0].fieldGroup.push(this.buildFormObject(attribute, entity));
      }
    }

    formlyFields = this.formlyFunctionsService.getJsonFormParse(formlyFields, '');
    return formlyFields;
  }

  private buildFormObject(attribute: Attribute, entity: Entity) {
    if (attribute.type?.includes('Radio')) {
      debugger;
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'radio',
        templateOptions: {
          label: attribute.name,
          description: 'Description',
          required: attribute.required,
          options: [],
        },
        hooks: {
          onInit: this.getDefinitionHooks(attribute, entity),
        },
      };
    }
    if (attribute.type?.includes('Option')) {
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'select',
        templateOptions: {
          label: attribute.name,
          description: 'Description',
          required: attribute.required,
          options: [],
        },
        hooks: {
          onInit: this.getDefinitionHooks(attribute, entity),
        },
      };
    }
    if (attribute.type?.includes('Text')) {
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'input',
        modelOptions: {
          updateOn: 'blur',
        },
        templateOptions: {
          type: attribute.type.toLowerCase(),
          label: attribute.name,
          minLength: attribute.min_length,
          maxLength: attribute.max_length,
          description: 'Description',
          required: attribute.required,
          disabled: attribute.disabled,
        },
        hooks: {
          onInit: this.getDefinitionHooks(attribute, entity),
        },
      };
    }
    if (attribute.type?.includes('Datetime') || attribute.type?.includes('Date')) {
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'input',
        templateOptions: {
          type: 'date',
          label: attribute.name,
          minLength: attribute.min_length,
          maxLength: attribute.max_length,
          description: 'Description',
          required: attribute.required,
          disabled: attribute.disabled,
        },
        hooks: {
          onInit: this.getDefinitionHooks(attribute, entity),
        },
      };
    }
    if (attribute.type?.includes('Number')) {
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'input',
        modelOptions: {
          updateOn: 'blur',
        },
        templateOptions: {
          type: 'text',
          minLength: attribute.min_length,
          maxLength: attribute.max_length,
          min: attribute.min_length,
          max: attribute.max_length,
          label: attribute.name,
          placeholder: attribute.description,
          description: 'Description',
          required: attribute.required,
          disabled: attribute.disabled,
        },
        hooks: {
          onInit: this.getDefinitionHooks(attribute, entity),
        },
      };
    }
    if (attribute.type?.includes('Email')) {
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'input',
        modelOptions: {
          updateOn: 'blur',
        },
        templateOptions: {
          type: 'text',
          minLength: attribute.min_length,
          maxLengthax: attribute.max_length,
          label: attribute.name,
          placeholder: attribute.description,
          description: 'Description',
          // pattern: /(\d{1,3}\.){3}\d{1,3}/,
          // pattern: new RegExp('^[a-z]+[a-z0-9._-]+@[a-z-]+\\.[a-z.]{2,5}$'),
          required: attribute.required,
          disabled: attribute.disabled,
        },
      };
    }
    if (attribute.type?.includes('Checkbox')) {
      return {
        className: 'p-col-6',
        key: attribute.id,
        type: 'checkbox',
        templateOptions: {
          label: attribute.name,
          description: 'Description',
          // required: elm.attribute.required,
          // pattern: 'true',
          required: true,
        },
      };
    }
    return {
      className: 'p-col-6',
      key: attribute.id,
      type: 'input',
      templateOptions: {
        type: 'text',
        label: attribute.name,
        description: 'Description',
        required: attribute.required,
        disabled: attribute.disabled,
      },
    };
  }

  private getDefinitionHooks(attribute: any, entity: Entity): string {
    const definitionList: string[] = [];
    if (attribute.entities_attributes_dataset) {
      definitionList.push('f_dataset');
    }
    if (attribute.entities_attributes_cascading_dataset) {
      definitionList.push('f_cascading_dataset');
    }
    if (attribute.entities_attributes_autofills?.is_search) {
      definitionList.push('f_autofill');
    }

    const functionsDefinition: FunctionsDefinition = {};
    functionsDefinition.attribute = attribute;
    functionsDefinition.entity = entity;
    functionsDefinition.functions = definitionList;
    return 'def=' + JSON.stringify(functionsDefinition);
  }

}
