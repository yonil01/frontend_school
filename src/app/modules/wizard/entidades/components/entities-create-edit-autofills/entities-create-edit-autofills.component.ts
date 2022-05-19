import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Autofill, Entity, Response} from "@app/core/models";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Store} from "@ngrx/store";
// @ts-ignore
import {v4 as uuidv4} from 'uuid';
import {AppState} from "@app/core/store/app.reducers";
import {addEntity, editEntity} from "@app/core/store/actions/entity.action";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Client, Project} from "@app/core/models/wizard/wizard";
import {ToastModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";
import {nonUpperCaseValidator, noWhitespaceValidator} from "@app/modules/wizard/entidades/utils/validators";

@Component({
  selector: 'app-entities-create-edit-autofills',
  templateUrl: './entities-create-edit-autofills.component.html',
  styleUrls: ['./entities-create-edit-autofills.component.scss']
})
export class EntitiesCreateEditAutofillsComponent implements OnInit {
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Input()
  public selectedEntity!: Entity
  @Output()
  public message: EventEmitter<ToastModel> = new EventEmitter();
  @Input()
  public selectedAutofill!: Autofill;
  public isEdit: boolean = false;
  public entity!: Entity;
  public createEditForm!: FormGroup;
  public client!: Client;
  public project!: Project;
  public isBlock: boolean = false;

  constructor(private autofillsService: AutofillsService,
              private store: Store<AppState>,
              private _fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.entity = this.selectedEntity;
    this.createEditForm = this._fb.group({
      name: ['', [Validators.required, noWhitespaceValidator(), Validators.maxLength(50), Validators.minLength(3), nonUpperCaseValidator()]],
      description: ['', [Validators.required]],
      outside: [false, [Validators.required]],
      process: [''],
    })
    if (this.selectedAutofill) {
      this.isEdit = true;
      this.createEditForm.setValue({
        name: this.selectedAutofill.name,
        description: this.selectedAutofill.description,
        outside: this.selectedAutofill.outside,
        process: this.selectedAutofill.process,
      })
      this.createEditForm.get('name')?.disable()
    }
    if (sessionStorage.getItem('client') && sessionStorage.getItem('project')) {
      // @ts-ignore
      this.client = JSON.parse(sessionStorage.getItem('client'));
      // @ts-ignore
      this.project = JSON.parse(sessionStorage.getItem('project'));
    }
  }

  onCancelCreateAutofill() {
    this.onReturn()
  }

  onReturn() {
    this.isReturn.emit({
      id: 'autofill',
      from: 'create',
      value: true
    });
  }

  onCreateAutofill(entity: Entity) {
    if (this.entity.id) {
      const autofillPersistent: Autofill = {...this.createEditForm.value};
      autofillPersistent.id = uuidv4().toLowerCase();
      autofillPersistent.entities_id = this.entity.id.toLowerCase();
      this.isBlock = true;
      // @ts-ignore
      this.autofillsService.createAutofills(autofillPersistent).subscribe((res: Response) => {
        if (res.error) {
          this.message.emit({
            type: 'error',
            message: res.msg,
            life: 5000,
          });
          this.isBlock = false;
        } else {
          this.message.emit({
            type: 'sucess',
            message: "Created Autofill successfully",
            life: 5000,
          });
          this.store.dispatch(addEntity({entity}));
          this.isBlock = false;
          this.onReturn();
        }
      });
    }

  }

  editAutofill() {
    if (this.entity.id) {
      if (this.selectedAutofill.id) {
        const autofillPersistent: Autofill = {
          ...this.selectedAutofill,
          ...this.createEditForm.value,
          id: this.selectedAutofill.id.toLowerCase(),
          entities_id: this.entity.id.toLowerCase(),
        };
        this.isBlock = true;
        // @ts-ignore
        this.autofillsService.updateAutofills(autofillPersistent).subscribe((res: Response) => {
          if (res.error) {
            this.message.emit({
              type: 'error',
              message: res.msg,
              life: 5000,
            });
            this.isBlock = false;
          } else {
            this.message.emit({
              type: 'sucess',
              message: "Actualización exitosa",
              life: 5000,
            });
            this.isBlock = false;
            this.onReturn()
          }
        });
      }
    }
  }


  onSubmitForm() {
    if (this.createEditForm.valid) {
      if (this.isEdit) {
        this.editAutofill()
      } else {
        this.onCreateAutofill(this.createEditForm.value)
      }
    } else {
      console.log('error', 'Error en la creación', 'Por favor complete los campos requeridos', 5000);
    }
  }
}
