import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Execution, ExecutionRole, Queue, Role, RolesDisplay, StepModel} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "ecapture-ng-ui";
import {FilterService} from "@app/ui/services/filter.service";
import {IconsMaterial} from "@app/core/constants/icons/material-icons";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {typeTasks, typeTimes} from "@app/core/utils/constants/constant";
import {v4 as uuidv4} from "uuid";
import {Subscription} from "rxjs/internal/Subscription";
import {ProcessService} from "@app/modules/wizard/services/process/process.service";

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  @Input() task!: Execution;
  @Input() typeTask: string = '';
  @Input('queue') queue!: Queue;
  @Input('roles') roles: Role[] = [];
  @Output('cancel-form') cancelForm: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('save-task') saveTaskEvent: EventEmitter<Execution> = new EventEmitter<Execution>();
  @Output('save-role') saveRoleEvent: EventEmitter<ExecutionRole> = new EventEmitter<ExecutionRole>();

  public steps: StepModel[] = [
    {id: 1, name: 'GENERAL_INFORMATION', active: true}
  ];

  public positionStep: number = 0;
  public operation: string = 'add';
  public taskForm: FormGroup;
  public icons: any[] = IconsMaterial;
  public readonly dropStyle: DropdownModel = dropStyle;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public timers: DataDrop[] = typeTimes;
  public blockPage: boolean = false;
  public _subscription: Subscription = new Subscription();
  public tasks: Execution[] = [];
  public executionSelected!: Execution;
  public rolesDisplay: RolesDisplay[] = [];
  public rolesPagination: RolesDisplay[] = [];
  public rolesAvailable: RolesDisplay[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: ToastService,
    private _filterService: FilterService,
    private _processService: ProcessService,
  ) {
    this.taskForm = fb.group({
      class: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: ['', Validators.required],
      timer: [''],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8000)]],
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnInit(): void {
    if (this.typeTask === 'USER') {
      this.steps.push({id: 2, name: 'ROLES', active: false});
      this.taskForm.get('type')?.setValue('User');
    } else if (this.typeTask === 'SYSTEM') {
      this.taskForm.get('type')?.setValue('System');
    } else {
      this.taskForm.get('type')?.setValue('Timer');
      this.activeTimers();
    }
  }

  public activeTimers(): void {
    this.taskForm.get('timer')?.setValidators([Validators.required]);
    this.taskForm.get('timer')?.updateValueAndValidity();
  }

  public changeRole($event: boolean, roleID: string): void {
    if ($event) {
      const executionRole: ExecutionRole = {
        id: uuidv4().toLowerCase(),
        execution_id: this.executionSelected.id?.toLowerCase(),
        role_id: roleID.toLowerCase(),
      };
      this.createExecutionRole(executionRole, roleID)
    } else {
      const processRole = this.task.execution_roles?.find((pdt) => pdt?.role?.id?.toLowerCase() === roleID.toLowerCase());
      if (processRole) {
        this.deleteExecutionRole(processRole)
      }
    }
  }

  public saveTask(): void {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
      formValues.type = typeTasks.find((t) => t.label === formValues.type)?.value || 3;
      const execution: Execution = {
        ...formValues,
        id: uuidv4().toLowerCase(),
        queue_id: this.queue.id?.toLowerCase(),
      };
      if (this.operation === 'add') {
        this.createTask(execution)
      } else {
        execution.id = this.executionSelected.id?.toLowerCase();
        this.updateTask(execution);
      }
    } else {
      this.taskForm.markAllAsTouched();
      this.messageService.add({type: 'warning', message: 'Complete correctamente todos los campos!', life: 5000});
    }
  }

  public filterRoles(event: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name' || 'type' || 'label').split(',');
      this.rolesDisplay = this._filterService.filter(this.rolesAvailable, searchFields, filterValue, 'contains');
    } else {
      this.rolesDisplay = this.rolesAvailable;
    }
  }

  public backStep(): void {
    this.positionStep--;
    this.steps[this.positionStep].active = false;
  }

  public cancelCreateOrEdit(): void {
    this.cancelForm.emit(true);
    this.positionStep = 0;
    this.steps[1].active = false;
    this.taskForm.reset();
    this.operation = 'add';
  }

  private loadProcessProcessRoles(task: Execution): void {
    this.rolesDisplay = [];
    this.rolesAvailable = [];
    if (task) {
      for (const r of this.roles) {
        if (task.execution_roles?.find((pdt) => pdt?.role?.id?.toLowerCase() === r.id?.toLowerCase())) {
          this.rolesDisplay.push({role: r, active: true});
        } else {
          this.rolesDisplay.push({role: r, active: false});
        }
      }
      this.rolesAvailable = [...this.rolesDisplay];
    }
  }

  private createTask(execution: Execution): void {
    this.blockPage = true;
    this._subscription.add(
      this._processService.createExecution(execution).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            execution.execution_roles = [];
            this.executionSelected = execution;
            this.saveTaskEvent.emit(execution);
            if (execution.type === 3) {
              this.positionStep++;
              this.steps[this.positionStep].active = true;
              this.loadProcessProcessRoles(execution);
            }
            this.messageService.add({type: 'success', message: 'Ejecuión creada correctamente!', life: 5000});
          }
          this.blockPage = false;
        },
        error: (err: Error) => {
          this.blockPage = false;
          console.error(err.message);
          this.messageService.add({type: 'error', message: 'No se pudo crear la ejecución!', life: 5000});
        },
      })
    );
  }

  private updateTask(execution: Execution): void {
    this.blockPage = true;
    this._subscription.add(
      this._processService.updateExecution(execution).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.positionStep++;
            const indexExecution = this.tasks.findIndex((t) => t.id?.toLowerCase() === execution.id?.toLowerCase());
            if (indexExecution !== -1) {
              this.tasks[indexExecution].name = execution.name;
              this.tasks[indexExecution].type = execution.type;
              this.tasks[indexExecution].class = execution.class;
              this.tasks[indexExecution].description = execution.description;
              this.tasks[indexExecution].timer = execution.timer;
              this.executionSelected = execution;
              if (execution.type === 3) {
                this.loadProcessProcessRoles(execution);
              }
            }
            this.steps[this.positionStep].active = true;
          }
          this.blockPage = false;
        },
        error: (err: Error) => {
          this.blockPage = false;
          console.error(err.message);
          this.messageService.add({type: 'error', message: 'No se pudo actualizar la ejecución!', life: 5000});
        }
      })
    );
  }

  private createExecutionRole(executionRole: ExecutionRole, roleID: string): void {
    this.blockPage = true;
    this._subscription.add(
      this._processService.createExecutionRole(executionRole).subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
              const indexRoleDisplay = this.rolesDisplay.findIndex((r) => r.role.id?.toLowerCase() === roleID.toLowerCase());
              if (indexRoleDisplay !== -1) {
                this.rolesDisplay[indexRoleDisplay].active = false;
                this.rolesAvailable = this.rolesDisplay.map(role => role);
              }
            } else {
              this.messageService.add({type: 'success', message: 'Rol Asignado correctamente!', life: 5000});
              const indexRoleDisplay = this.rolesDisplay.findIndex((r) => r.role.id?.toLowerCase() === roleID.toLowerCase());
              if (indexRoleDisplay !== -1) {
                this.rolesDisplay[indexRoleDisplay].active = true;
                this.rolesAvailable = this.rolesAvailable = this.rolesDisplay.map(role => role);
              }
              this.saveRoleEvent.emit(executionRole);
            }
            this.blockPage = false;
          },
          error: (err: Error) => {
            this.blockPage = false;
            console.error(err.message);
            this.messageService.add({type: 'error', message: 'No se pudo asignar el rol!', life: 5000});
          },
        }
      )
    );
  }

  private deleteExecutionRole(processRole: ExecutionRole): void {
    this.blockPage = true;
    this._subscription.add(
      this._processService.deleteExecutionRole(processRole.id?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            const indexExecution = this.tasks.findIndex((r) => r.id?.toLowerCase() === this.executionSelected.id?.toLowerCase());
            if (indexExecution !== -1) {
              this.executionSelected.execution_roles = this.executionSelected.execution_roles?.filter((r) => r.id?.toLowerCase() !== processRole.id?.toLowerCase());
              this.tasks[indexExecution].execution_roles = this.executionSelected.execution_roles;
              this.messageService.add({type: 'success', message: 'Rol Desasignado correctamente!', life: 5000});
            }
          }
          this.blockPage = false;
        },
        error: (err: Error) => {
          this.blockPage = false;
          console.error(err.message);
          this.messageService.add({type: 'error', message: 'No se pudo eliminar el rol!', life: 5000});
        },
      })
    );
  }

}
