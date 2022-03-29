import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Autofill, CascadingDataset, Entity, Response} from "@app/core/models";
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

@Component({
  selector: 'app-entity-create-edit-cascading',
  templateUrl: './entity-create-edit-cascading.component.html',
  styleUrls: ['./entity-create-edit-cascading.component.scss']
})
export class EntityCreateEditCascadingComponent implements OnInit {
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Input()
  public selectedEntity!: Entity
  @Output()
  public message: EventEmitter<ToastModel> = new EventEmitter();
  @Input()
  public selectedCascading!: CascadingDataset;
  public isEdit: boolean = false;
  public entity!: Entity;
  public createEditForm!: FormGroup;
  public client!: Client;
  public project!: Project;
  public isBlock: boolean = false;
  private onCreateCascade: boolean = false;

  constructor(private autofillsService: AutofillsService,
              private store: Store<AppState>,
              private _fb: FormBuilder,
              private entityService: EntityService
  ) {

  }

  ngOnInit(): void {
    this.entity = this.selectedEntity;
    this.createEditForm = this._fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      outside: [false, [Validators.required]],
      process: [''],
    })
    // if (this.selectedAutofill) {
    //   this.isEdit = true;
    //   this.createEditForm.setValue({
    //     name: this.selectedAutofill.name,
    //     description: this.selectedAutofill.description,
    //     outside: this.selectedAutofill.outside,
    //     process: this.selectedAutofill.process,
    //   })
    //   this.createEditForm.get('name')?.disable()
    // }
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
      id: 'cascading',
      from: 'create',
      value: true
    });
  }

  createCascade(entity: Entity) {
    debugger
    if (this.entity.id) {
      const cascadingPersistent: CascadingDataset = {...this.createEditForm.value};
      cascadingPersistent.id = uuidv4().toLowerCase();
      cascadingPersistent.entities_id = this.entity.id.toLowerCase();
      this.isBlock = true;
      // @ts-ignore
      this.entityService.createCascadingDatasets(cascadingPersistent).subscribe((res: any) => {
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
            message: 'Creación exitosa',
            life: 5000,
          });
          this.isBlock = false;
          this.onReturn();
        }
      });
    }

  }

  editCascade() {
    if (this.entity.id) {
      if (this.selectedCascading.id) {
        const autofillPersistent: Autofill = {
          ...this.selectedCascading,
          ...this.createEditForm.value,
          id: this.selectedCascading.id.toLowerCase(),
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


  onSubmitForm(state: string) {
    switch (state) {
      case 'submit':
        if (this.createEditForm.valid) {
          this.onCreateCascade = false;
          this.createCascade(this.entity);
        } else {
          this.message.emit({
            type: 'error',
            message: 'Por favor, verifique los campos en rojo',
            life: 5000
          })
        }
        break;
      case 'cancel':
        this.onReturn()
        break;
      // case 'sure':
      //   this.onCreateAttribute = true;
      //   break;
      // case 'cancelSure':
      //   this.onCreateAttribute = false;
    }
  }
}
