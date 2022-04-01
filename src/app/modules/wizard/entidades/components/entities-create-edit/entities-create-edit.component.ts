import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Entity, Response} from "@app/core/models";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Store} from "@ngrx/store";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import {AppState} from "@app/core/store/app.reducers";
import {addEntity, editEntity} from "@app/core/store/actions/entity.action";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Client, Project} from "@app/core/models/wizard/wizard";
import {ToastModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {noWhitespaceValidator} from "@app/modules/wizard/entidades/utils/validators";

@Component({
  selector: 'app-entities-create-edit',
  templateUrl: './entities-create-edit.component.html',
  styleUrls: ['./entities-create-edit.component.scss']
})
export class EntitiesCreateEditComponent implements OnInit {
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Input()
  public selectedEntity!: Entity
  @Output()
  public message: EventEmitter<ToastModel> = new EventEmitter();
  public isEdit: boolean = false;
  public entity!: Entity;
  public createEditForm!: FormGroup;
  public client!: Client;
  public project!: Project;
  public isBlock: boolean = false;
  constructor(private entityService: EntityService,
              private store: Store<AppState>,
              private _fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.createEditForm = this._fb.group({
      name: ['', [Validators.required, noWhitespaceValidator(), Validators.minLength(3), Validators.maxLength(50)]],
      is_unique: [false]
    })
    if (this.selectedEntity) {
      this.isEdit = true;
      this.entity = this.selectedEntity;
     this.createEditForm.setValue({
        name: this.entity.name,
        is_unique: this.entity.is_unique
      })
      this.createEditForm.get('is_unique')?.disable()
    }
    if (sessionStorage.getItem('client') && sessionStorage.getItem('project')) {
      // @ts-ignore
      this.client = JSON.parse(sessionStorage.getItem('client'));
      // @ts-ignore
      this.project = JSON.parse(sessionStorage.getItem('project'));
    }
  }

  onCancelCreateEntities() {
   this.onReturn()
  }

  onReturn() {
    this.isReturn.emit({
      id: 'create',
      from: 'create',
      value: true
    });
  }

  onCreateEntity(entity: Entity) {
    if(this.createEditForm.valid) {
      if (entity) {
        const entity: Entity = {
          ...this.createEditForm.value,
          id: uuidv4().toLowerCase(),
          project_id: this.project.id.toLowerCase(),
        };
        this.isBlock = true;
        // @ts-ignore
        this.entityService.createEntity(entity).subscribe((res: Response) => {
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
              message: "Created entity successfully",
              life: 5000,
            });
            this.store.dispatch(addEntity({entity}));
            this.isBlock = false;
            this.onReturn();
          }
        });
      }
    } else {
      this.message.emit({
        type: 'error',
        message: 'Please fill all the required fields',
        life: 5000,
      });
    }
  }

  editEntity() {
    const entity: Entity = {
      ...this.entity,
      ...this.createEditForm.value,
      id: this.entity.id?.toLowerCase(),
      project_id: this.project.id.toLowerCase(),
    };
    delete entity.attributes
    delete entity.project
    this.isBlock = true;
    // @ts-ignore
    this.entityService.updateEntity(entity).subscribe((res: Response) => {
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
        this.store.dispatch(editEntity({entity: entity}));
        this.isBlock = false;
        this.onReturn()
      }
    });
  }

  onSubmitForm() {
    if (this.createEditForm.valid) {
      if (this.isEdit) {
        this.editEntity()
      } else {
        this.onCreateEntity(this.createEditForm.value)
      }
    } else {
      console.log('error', 'Error en la creación', 'Por favor complete los campos requeridos', 5000);
    }
  }
}
