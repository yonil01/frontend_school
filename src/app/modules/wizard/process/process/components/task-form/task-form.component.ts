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

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {
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
  private selectionRoles: RolesDisplay[] = [];
  public rolesDisplay: RolesDisplay[] = [];
  public rolesPagination: RolesDisplay[] = [];
  public selectionAttributesNow: Attribute[] = [];
  private selectionAttributesBefore: Attribute[] = [];
  public balanceType: any[] = [];
  private client: string = '';
  private project!: Project;
  public commentsOptions: QueueComment[] = [];
  public commentsPaginator: QueueComment[] = [];
  public commentSelected: QueueComment = {id: '', comment: '', queue_id: ''};
  public commentForm: FormControl;
  private readonly typeQueue: any;
  private element: any;
  private parentQueue!: Queue;
  private bpm!: Process;
  public isBlockPage: boolean = false;
  public showConfirm: boolean = false;

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
    this.typeQueue = {
      'bpmn:SendTask': 1,
      'bpmn:ReceiveTask': 2,
      'bpmn:UserTask': 3,
      'bpmn:ManualTask': 4,
      'bpmn:BusinessRuleTask': 5,
      'bpmn:ServiceTask': 6,
      'bpmn:ScriptTask': 7,
      'bpmn:IntermediateCatchEvent': 8,
      'bpmn:ExclusiveGateway': 9,
      'bpmn:ParallelGateway': 10,
      'bpmn:InclusiveGateway': 11,
      'bpmn:ComplexGateway': 12,
      'bpmn:EventBasedGateway': 13,
    };
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
      console.log(this.parentQueue);
      this.element = res.element;
    });
  }

  private initForm(): void {
    this.selectionAttributesNow = [];
    this.selectionAttributesBefore = [];
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

  public changeComment(event: any): void {
    this.commentSelected = event.value;
    if (event.value) {
      this.commentForm.setValue(this.commentSelected.comment);
    } else {
      this.commentForm.reset();
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
    this._subscription.add(
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
    );
  }

  private preloadRoles(): void {
    const rolesSelected = this.parentQueue.queue_roles ? this.roles.filter((rl) => this.parentQueue.queue_roles?.find((rq) => rq?.role.id.toLowerCase() === rl.id?.toLowerCase())) : [];
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
    // @ts-ignore
    this.selectionAttributesNow = this.parentQueue.queue_attributes?.length ? this.attributes.filter((a) => this.parentQueue.queue_attributes[0].attribute.id.toLowerCase() === a.id?.toLowerCase()) : [];
    this.selectionAttributesBefore = this.selectionAttributesNow ? this.selectionAttributesNow : [];
    this.attributesDisplay = [...this.attributes];
  }

  public saveQueue(): void {
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
                this.positionStep++;
              }
              this.isBlockPage = false;
              this.updateQueueEvent.emit(res);
            },
            error: (err: Error) => {
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
                debugger;
                if (this.parentQueue.id) {
                  this.preloadRoles();
                  this.preloadAttributes();
                }
                this._messageService.add({type: 'success', message: 'Cola creada exitosamente', life: 5000});
                this.positionStep++;
              }
              this.isBlockPage = false;
              this.createQueueEvent.emit(res);
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({type: 'error', message: 'Error al crear la cola', life: 5000});
            }
          })
        );
      }
    } else {
      this.queueForm.markAllAsTouched();
      this._messageService.add({type: 'error', message: 'Complete todos los campos', life: 5000});
    }
  }

  public unselectedAttribute(attribute: Attribute): void {
    if (this.parentQueue.queue_attributes?.length) {
      this._subscription.add(
        this.processService.deleteQueueAttribute(attribute.id.toLowerCase()).subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.parentQueue.queue_attributes?.splice(0, 1);
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
      const searchFields: string[] = ('name' || 'description' || 'label').split(',');
      this.attributesDisplay = this._filterService.filter(this.attributes, searchFields, filterValue, 'contains');
    } else {
      this.attributesDisplay = this.attributes;
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
                this.parentQueue.queue_roles = this.parentQueue.queue_roles?.filter((qr) => qr.role.id.toLowerCase() !== role.id?.toLowerCase());
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
                if (this.selectionAttributesBefore) {
                  this.unselectedAttribute(this.selectionAttributesBefore[0]);
                }
                queueAttributePersistense.attribute = attribute;
                this.parentQueue.queue_attributes = this.parentQueue.queue_attributes ? this.parentQueue.queue_attributes : [];
                this.parentQueue.queue_attributes.push(queueAttributePersistense);
                this.updateQueueEvent.emit(res);
                this.selectionAttributesBefore = this.selectionAttributesNow;
                this.selectionAttributesNow = [attribute];
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