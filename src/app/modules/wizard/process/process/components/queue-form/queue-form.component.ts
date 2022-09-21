import {Component, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
// store
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {BpmState} from '@app/core/store/reducers';
// Services
import {RoleService} from '@app/core/services/graphql/auth/role/role.service';
import {EntityService} from '@app/modules/wizard/services/entity/entity.service';
// Models
import {
  Process,
  Queue,
  Role,
  Attribute,
  Response,
  Project,
  QueueRole,
  QueueAttribute,
  StepModel, RolesDisplay
} from '@app/core/models';
import {QueueComment} from '@app/core/models/config/process';
import {v4 as uuidv4} from 'uuid';
import {ProcessService} from '@app/modules/wizard/services/process/process.service';
import {ToastService} from "ecapture-ng-ui";
import {Subscription} from "rxjs/internal/Subscription";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {FilterService} from "@app/ui/services/filter.service";
import {HttpErrorResponse} from "@angular/common/http";
import {typesQueues} from "@app/core/utils/constants/constant";
import {IconsMaterial} from "@app/core/constants/icons/material-icons";

@Component({
  selector: 'app-queue-form',
  templateUrl: './queue-form.component.html',
  styleUrls: ['./queue-form.component.scss']
})
export class QueueFormComponent implements OnInit, OnDestroy {
  @Output() createQueueEvent = new EventEmitter<Response>();
  @Output() updateQueueEvent = new EventEmitter<Response>();
  @Output() updateNameEvent = new EventEmitter<string>();
  private _subscription: Subscription = new Subscription();
  public readonly dropStyle: DropdownModel = dropStyle;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public queueForm!: FormGroup;
  public steps: StepModel[] = [
    {id: 1, name: 'GENERAL_INFORMATION', active: true},
    {id: 2, name: 'ROLES', active: false},
    {id: 3, name: 'ATTRIBUTES', active: false}
  ];
  public positionStep: number = 0;
  public roles: Role[] = [];
  public attributes: Attribute[] = [];
  public attributesDisplay: Attribute[] = [];
  public attributesPagination: Attribute[] = [];
  private selectionRoles: RolesDisplay[] = [];
  public rolesDisplay: RolesDisplay[] = [];
  public rolesPagination: RolesDisplay[] = [];
  public selectionAttributesNow: Attribute[] = [];
  public selectionAttributesNowId: string = '';
  private selectionAttributesBeforeID: string = '';
  public balanceType: any[] = [];
  private client: string = '';
  private project!: Project;
  public commentsOptions: QueueComment[] = [];
  public commentsPaginator: QueueComment[] = [];
  public commentSelected: QueueComment = {id: '', comment: '', queue_id: ''};
  public commentForm: FormControl;
  private readonly typeQueue: any = typesQueues;
  private element: any;
  private parentQueue!: any;
  private bpm!: Process;
  public isBlockPage: boolean = false;
  public showConfirm: boolean = false;
  public icons: any[] = IconsMaterial;

  constructor(
    private roleService: RoleService,
    private entityService: EntityService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private processService: ProcessService,
    private _messageService: ToastService,
    private _filterService: FilterService
  ) {
    this.balanceType = [
      {value: 0, label: 'Activo'},
      {value: 1, label: 'Inactivo'},
    ];
    this.attributes = [];
    this.getBpmState();
    this.commentForm = new FormControl(null);
  }

  ngOnInit() {
    this.rolesPagination = [];
    this.client = sessionStorage.getItem('client') || '';
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.initForm();
    this.getRoles();
    this.getKeywords();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getBpmState(): void {
    this.store.select('bpm').subscribe((res: BpmState) => {
      this.bpm = res.bpm;
      this.parentQueue = JSON.parse(JSON.stringify(res.task));
      this.element = res.element;
    });
  }

  private initForm(): void {
    this.selectionAttributesNow = [];
    this.selectionRoles = [];
    const info = this.parentQueue.name ? this.parentQueue : null;
    this.commentsOptions = this.parentQueue.comments ? JSON.parse(JSON.stringify(this.parentQueue.comments)) : [];
    this.queueForm = new FormGroup({
      name: new FormControl(info ? info.name : null, Validators.required),
      sequences: new FormControl(info ? info.sequences : this.bpm.queues ? this.bpm.queues.length + 1 : 1, Validators.required),
      balance_type: new FormControl(info ? +info.balance_type : null, Validators.required),
      class: new FormControl(info ? info.class : null, Validators.required),
      ans: new FormControl(info ? info.ans : null, Validators.required),
      percent_alert: new FormControl(info ? +info.percent_alert : null, Validators.required),
      must_confirm_comment: new FormControl(info ? info.must_confirm_comment : false, Validators.required),
      comments: new FormControl(''),
      description: new FormControl(info ? info.description : null, Validators.required),
    });
    if (this.element.name) this.queueForm.patchValue({name: this.element.name});
  }

  public updateName(): void {
    this.updateNameEvent.emit(this.queueForm.get('name')?.value);
  }

  public saveComment(): void {
    if (this.commentSelected.id === '') {
      this.addComment();
    } else {
      this.updateComment();
    }
  }

  private addComment(): void {
    if (this.commentForm.value !== '') {
      const commentPersisten: QueueComment = {
        id: uuidv4().toLowerCase(),
        comment: this.commentForm.value,
        queue_id: this.parentQueue.id?.toLowerCase()
      };
      this.isBlockPage = true;
      this._subscription.add(
        this.processService.createQueueComment(commentPersisten).subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000})
            } else {
              this.commentsOptions = [...this.commentsOptions, commentPersisten];
              this.commentForm.reset();
            }
            this.isBlockPage = false;
            this.updateQueueEvent.emit(res);
          },
          error: (err: HttpErrorResponse) => {
            this.isBlockPage = false;
            console.error(err.error);
            this._messageService.add({
              type: 'error',
              message: err.error.msg,
              life: 5000
            });
          }
        })
      );
    } else {
      this.commentForm.markAllAsTouched();
      this._messageService.add({type: 'warning', message: 'El comentario no puede estar vacío!', life: 5000});
    }
  }

  private updateComment(): void {
    if (this.commentForm.value !== '') {
      const commentPersisten: QueueComment = {
        id: this.commentSelected.id?.toLowerCase(),
        comment: this.commentForm.value,
        queue_id: this.parentQueue.id?.toLowerCase()
      };
      this.isBlockPage = true;
      this._subscription.add(
        this.processService.updateQueueComment(commentPersisten).subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              const indexComment = this.commentsOptions.findIndex((cm) => cm.id?.toLowerCase() === this.commentSelected.id?.toLowerCase());
              if (indexComment !== -1) {
                this.commentsOptions[indexComment] = commentPersisten;
              }
              this.commentSelected = {comment: '', id: '', queue_id: ''};
              this.commentForm.reset();
            }
            this.isBlockPage = false;
            this.updateQueueEvent.emit(res);
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            console.error(err.message);
            this._messageService.add({
              type: 'error',
              message: 'Error al actualizar el comentario',
              life: 5000
            });
          }
        })
      );
    } else {
      this._messageService.add({type: 'warning', message: 'El comentario no puede estar vacío!', life: 5000});
      this.commentForm.markAllAsTouched();
    }
  }

  public confirmDeleteComment(event: boolean): void {
    if (event) {
      this.deleteComment();
    } else {
      this.showConfirm = false;
      this.commentSelected = {comment: '', id: '', queue_id: ''};
    }
  }

  private deleteComment(): void {
    if (this.commentSelected) {
      this._subscription.add(
        this.processService.deleteQueueComment(this.commentSelected.id?.toLowerCase() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.commentsOptions = this.commentsOptions.filter((cm) => cm.id?.toLowerCase() !== this.commentSelected.id?.toLowerCase());
              this.commentSelected = {comment: '', id: '', queue_id: ''};
              this._messageService.add({type: 'success', message: 'Comentario borrado correctamente', life: 5000});
            }
            this.updateQueueEvent.emit(res);
          },
          error: (err: Error) => {
            console.error(err.message);
            this._messageService.add({
              type: 'error',
              message: 'Error al borrar el comentario',
              life: 5000
            });
          }
        })
      );
    }
  }

  private getRoles(): void {
    /*this._subscription.add(
      this.roleService.getRoles().subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.roles = res.data;
            if (this.parentQueue.id) this.preloadRoles();
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this._messageService.add({type: 'error', message: 'Error al cargar los roles!', life: 5000});
        }
      })
    );*/
  }

  private preloadRoles(): void {
    const rolesSelected = this.parentQueue.queue_roles ? this.roles.filter((rl) => this.parentQueue.queue_roles?.find((rq: any) => rq?.role.id.toLowerCase() === rl.id?.toLowerCase())) : [];
    for (const rol of this.roles) {
      if (rolesSelected.find((r) => r.id === rol.id)) {
        this.rolesDisplay.push({role: rol, active: true});
      } else {
        this.rolesDisplay.push({role: rol, active: false});
      }
    }
    this.selectionRoles = this.rolesDisplay;
  }

  private getKeywords(): void {
    this._subscription.add(
      this.entityService.getEntitiesByProject(this.project.id.toLowerCase()).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            res.data.forEach((a: any) => (this.attributes = this.attributes.concat(a.attributes)));
            this.attributes = this.attributes.filter((a) => a);
            if (this.parentQueue.id) this.preloadAttributes();
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this._messageService.add({type: 'error', message: 'Error al cargar las entidades del proyecto', life: 5000});
        }
      })
    );
  }

  private preloadAttributes(): void {
    if (this.parentQueue.queue_attributes) {
      const queueAttributeID = this.parentQueue.queue_attributes[0].attribute?.id || '';
      this.selectionAttributesNow = this.attributes.filter((a) => queueAttributeID.toLowerCase() === a.id?.toLowerCase());
      this.selectionAttributesNowId = this.parentQueue.queue_attributes[0].id;
      this.selectionAttributesBeforeID = this.parentQueue.queue_attributes[0].id;
    }
    this.attributesDisplay = [...this.attributes];
  }

  public saveQueue(isNextStep: boolean): void {
    if (this.queueForm.valid) {
      if (this.parentQueue.id) {
        const queuePersistense = {...this.parentQueue, ...this.queueForm.value};
        queuePersistense.id = this.parentQueue.id.toLowerCase();
        queuePersistense.process_id = this.bpm.id?.toLowerCase() || '';
        queuePersistense.id_bpmn_element = this.element.id;
        queuePersistense.status = 0;
        queuePersistense.type = this.typeQueue[this.element.$type];
        delete queuePersistense.comments;
        delete queuePersistense.queue_attributes;
        delete queuePersistense.queue_roles;
        delete queuePersistense.executions;
        this.isBlockPage = true;
        this._subscription.add(
          this.processService.updateQueue(queuePersistense).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this._messageService.add({type: 'success', message: 'Cola actualizada correctamente', life: 5000});
                if (this.parentQueue.id) {
                  this.preloadRoles();
                  this.preloadAttributes();
                }
                if (isNextStep) {
                  this.positionStep++;
                  this.steps[this.positionStep].active = true;
                }
              }

              this.isBlockPage = false;
              this.updateQueueEvent.emit(res);
            },
            error: (err: HttpErrorResponse) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({type: 'error', message: 'Error al actualizar la cola', life: 5000});
            }
          })
        );
      } else {
        const queuePersistense: Queue = this.queueForm.value;
        queuePersistense.id = uuidv4().toLowerCase();
        queuePersistense.process_id = this.bpm.id?.toLowerCase() || '';
        queuePersistense.id_bpmn_element = this.element.id;
        queuePersistense.status = 0;
        queuePersistense.type = this.typeQueue[this.element.$type];
        delete queuePersistense.comments;
        this.isBlockPage = true;
        this._subscription.add(
          this.processService.createQueue(queuePersistense).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this.parentQueue = queuePersistense;
                if (this.parentQueue.id) {
                  this.preloadRoles();
                  this.preloadAttributes();
                }
                this._messageService.add({type: 'success', message: 'Cola creada exitosamente', life: 5000});
                if (isNextStep) {
                  this.positionStep++;
                  this.steps[this.positionStep].active = true;
                }
              }
              this.isBlockPage = false;
              this.createQueueEvent.emit(res);
            },
            error: (err: HttpErrorResponse) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({type: 'error', message: 'Error al crear la cola', life: 5000});
            }
          })
        );
      }
    } else {
      this.queueForm.markAllAsTouched();
      this._messageService.add({type: 'warning', message: 'Complete todos los campos del formulario correctamente', life: 5000});
    }
  }

  public unselectedAttribute(id: string): void {
    if (this.parentQueue.queue_attributes?.length) {
      this._subscription.add(
        this.processService.deleteQueueAttribute(id.toLowerCase()).subscribe({
          next: (res: any) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.parentQueue.queue_attributes = this.parentQueue.queue_attributes?.filter((queueAttribute: any) => queueAttribute.id !== id);
              this.updateQueueEvent.emit(res);
            }
          },
          error: (err: Error) => {
            console.error(err);
            this._messageService.add({message: 'Error al eliminar atributo', type: 'error', life: 5000});
          },
        })
      );
    }
  }

  public filterRoles(event: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name' || 'description' || 'label').split(',');
      this.rolesDisplay = this._filterService.filter(this.selectionRoles, searchFields, filterValue, 'contains');
    } else {
      this.rolesDisplay = this.selectionRoles;
    }
  }

  public filterAttributes(event: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name,description,label').split(',');
      this.attributesDisplay = this._filterService.filter(this.attributes, searchFields, filterValue, 'contains');
    } else {
      this.attributesDisplay = [...this.attributes];
    }
  }

  public changeRole($event: boolean, role: Role): void {
    if ($event) {
      const queueRolePersistense: QueueRole = {
        id: uuidv4().toLowerCase(),
        queue_id: this.parentQueue.id.toLowerCase(),
        role_id: role.id?.toLowerCase(),
      };
      this.isBlockPage = true;
      this._subscription.add(
        this.processService.createQueueRole(queueRolePersistense).subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              queueRolePersistense.role = role;
              this.parentQueue.queue_roles = this.parentQueue.queue_roles ? this.parentQueue.queue_roles : [];
              const roleFindIndex = this.rolesDisplay.findIndex((r) => r.role.id === role.id);
              if (roleFindIndex > -1) {
                this.rolesDisplay[roleFindIndex].active = true;
              }
              this.parentQueue.queue_roles.push(queueRolePersistense);
              this.updateQueueEvent.emit(res);
              this._messageService.add({type: 'success', message: 'Rol asignado correctamente', life: 5000});
            }
            this.isBlockPage = false;
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            console.error(err.message);
            this._messageService.add({
              type: 'error',
              message: 'Error al asignar el rol a la cola de trabajo!',
              life: 5000
            });
          }
        })
      );
    } else {
      const queueRole = this.parentQueue.queue_roles?.find((qr: QueueRole) => qr.role?.id?.toLowerCase() === role.id?.toLowerCase());
      if (queueRole) {
        this.isBlockPage = true;
        this._subscription.add(
          this.processService.deleteQueueRole(queueRole.id?.toLowerCase() || ' ').subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                const roleFindIndex = this.rolesDisplay.findIndex((r) => r.role.id === role.id);
                if (roleFindIndex > -1) {
                  this.rolesDisplay[roleFindIndex].active = false;
                }
                this.parentQueue.queue_roles = this.parentQueue.queue_roles?.filter((qr: any) => qr.role.id.toLowerCase() !== role.id?.toLowerCase());
                this.updateQueueEvent.emit(res);
              }
              this.isBlockPage = false;
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({type: 'error', message: 'Error al eliminar el rol', life: 5000});
            }
          })
        );
      }
    }
  }

  public addCommentStep(event: boolean): void {
    if (event) {
      if (!this.steps.find(s => s.id === 4)) {
        this.steps.push({
          id: 4,
          active: false,
          name: 'COMMENTS',
        });
      }
    } else {
      this.steps.pop();
    }
  }

  public isSelectedAttribute(attribute: Attribute): boolean {
    return this.selectionAttributesNow.length > 0 && this.selectionAttributesNow[0].id === attribute.id;
  }

  public changeAttribute(event: boolean, attribute: Attribute): void {
    if (event) {
      if (this.selectionAttributesNow) {
        const queueAttributePersistense: QueueAttribute = {
          id: uuidv4().toLowerCase(),
          queue_id: this.parentQueue.id.toLowerCase(),
          attribute_id: attribute.id.toLowerCase()
        };
        this.isBlockPage = true;
        this._subscription.add(
          this.processService.createQueueAttribute(queueAttributePersistense).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                if (this.selectionAttributesBeforeID) {
                  this.unselectedAttribute(this.selectionAttributesBeforeID);
                }
                queueAttributePersistense.attribute = attribute;
                this.parentQueue.queue_attributes = this.parentQueue.queue_attributes ? this.parentQueue.queue_attributes : [];
                this.parentQueue.queue_attributes.push(queueAttributePersistense);
                this.updateQueueEvent.emit(res);
                this.selectionAttributesBeforeID = this.selectionAttributesNowId;
                this.selectionAttributesNow = [attribute];
                this.selectionAttributesNowId = res.data.id;
                this._messageService.add({type: 'success', message: 'Atributo asignado correctamente', life: 5000});
              }
              this.isBlockPage = false;
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err);
              this._messageService.add({type: 'error', message: 'No se pudo asignar el atributo', life: 5000});
            },
          })
        );
      }
    }
  }

  public editComment(comment: QueueComment): void {
    this.commentSelected = comment;
    this.commentForm.setValue(comment.comment);
  }

}
