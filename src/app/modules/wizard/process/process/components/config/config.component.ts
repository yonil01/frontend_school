import {Component, Input, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {Execution, Role, Queue, ExecutionRole, StepModel, RolesDisplay} from '@app/core/models';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {RoleService} from '@app/core/services/graphql/auth/role/role.service';
import {ProcessService} from '@app/modules/wizard/services/process/process.service';
import {v4 as uuidv4} from 'uuid';
import {ToastService} from "ecapture-ng-ui";
import {FilterService} from "@app/ui/services/filter.service";
import {Subscription} from "rxjs/internal/Subscription";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {typeTasks, typeTimes} from "@app/core/utils/constants/constant";
import {IconsMaterial} from "@app/core/constants/icons/material-icons";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnChanges, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public showView: string = 'list';
  public readonly dropStyle: DropdownModel = dropStyle;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public positionStep: number = 0;

  @Input('queue-selected') parentQueue!: Queue;
  public taskForm: FormGroup;
  public icons: any[] = IconsMaterial;
  public tasks: Execution[] = [];
  public tasksDisplay: Execution[] = [];
  public tasksPagination: Execution[] = [];
  public selectionRoles: Role[] = [];
  public roles: Role[] = [];
  public rolesDisplay: RolesDisplay[] = [];
  public rolesPagination: RolesDisplay[] = [];
  public operation: string = 'add';
  public typesTasks: {value: number, label: string}[] = typeTasks;
  public task!: Execution;
  public rolesAvailable: RolesDisplay[];
  public timers: DataDrop[] = typeTimes;
  public steps: StepModel[] = [
    {id: 1, name: 'GENERAL_INFORMATION', active: true},
    {id: 2, name: 'ROLES', active: false}
  ];

  public executionSelected!: Execution;
  public showAlert: boolean = false;
  public blockPage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private processService: ProcessService,
    private messageService: ToastService,
    private _filterService: FilterService
  ) {
    this.taskForm = fb.group({
      class: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: ['', Validators.required],
      timer: [0],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8000)]],
    });
    this.rolesAvailable = [];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnChanges(): void {
    if (this.parentQueue) {
      this.getRoles();
      const taskFind = this.parentQueue.executions ? [...this.parentQueue.executions] : [];
      this.tasks = JSON.parse(JSON.stringify(taskFind));
      this.tasksDisplay = JSON.parse(JSON.stringify(taskFind));
    }
  }

  private getRoles(): void {
    this._subscription.add(
      this.roleService.getRoles().subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.roles = res.data;
            // this.rolesDisplay = res.data;
            if (this.parentQueue.id) this.preloadRoles();
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this.messageService.add({type: 'error', message: 'No se pudo obtener el listado de roles!', life: 5000});
        }
      })
    );
  }

  private preloadRoles(): void {
    this.selectionRoles = this.parentQueue.queue_roles ? this.roles.filter((rl) => this.parentQueue.queue_roles?.find((rq) => rq?.role.id.toLowerCase() === rl.id?.toLowerCase())) : [];
  }

  public backTasks(task: any): void {
    if (task) {
      const indexTask = this.tasks.findIndex((t) => t.id?.toLowerCase() === this.task.id?.toLowerCase());
      this.tasks[indexTask] = JSON.parse(JSON.stringify(task));
      this.showView = 'list';
    }
  }

  public saveTask(): void {
    if (this.taskForm.valid) {
      if (this.operation === 'add') {
        const execution: Execution = {
          ...this.taskForm.value,
          id: uuidv4().toLowerCase(),
          queue_id: this.parentQueue.id?.toLowerCase(),
        };
        this.blockPage = true;
        this._subscription.add(
          this.processService.createExecution(execution).subscribe({
            next: (res) => {
              if (res.error) {
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                execution.execution_roles = [];
                this.executionSelected = execution;
                this.tasks.push(execution);
                if (execution.type === 3) {
                  this.positionStep++;
                  this.steps[this.positionStep].active = true;
                  this.loadProcessProcessRoles(execution);
                }
                this.tasksDisplay = [...this.tasks];
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
      } else {
        const execution: Execution = {
          ...this.taskForm.value,
          id: this.executionSelected.id?.toLowerCase(),
          queue_id: this.parentQueue.id?.toLowerCase()
        };
        this.blockPage = true;
        this._subscription.add(
          this.processService.updateExecution(execution).subscribe({
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
    } else {
      this.taskForm.markAllAsTouched();
      this.messageService.add({type: 'warning', message: 'Complete correctamente todos los campos!', life: 5000});
    }
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

  public changeRole($event: boolean, roleID: string): void {
    if ($event) {
      const executionRole: ExecutionRole = {
        id: uuidv4().toLowerCase(),
        execution_id: this.executionSelected.id?.toLowerCase(),
        role_id: roleID.toLowerCase(),
      };
      this.blockPage = true;
      this._subscription.add(
        this.processService.createExecutionRole(executionRole).subscribe({
            next: (res) => {
              if (res.error) {
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
                const indexRoleDisplay = this.rolesDisplay.findIndex((r) => r.role.id?.toLowerCase() === roleID.toLowerCase());
                if (indexRoleDisplay !== -1) {
                  this.rolesDisplay[indexRoleDisplay].active = false;
                  this.rolesAvailable = [...this.rolesDisplay];
                }
              } else {
                this.messageService.add({type: 'success', message: 'Rol Asignado correctamente!', life: 5000});
                const indexRoleDisplay = this.rolesDisplay.findIndex((r) => r.role.id?.toLowerCase() === roleID.toLowerCase());
                if (indexRoleDisplay !== -1) {
                  this.rolesDisplay[indexRoleDisplay].active = true;
                  this.rolesAvailable = [...this.rolesDisplay];
                }
                const indexExecution = this.tasks.findIndex((r) => r.id?.toLowerCase() === this.executionSelected.id?.toLowerCase());
                if (indexExecution !== -1) {
                  this.tasks[indexExecution]?.execution_roles?.push(executionRole);
                }
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
    } else {
      const processRole = this.task.execution_roles?.find((pdt) => pdt?.role?.id?.toLowerCase() === roleID.toLowerCase());
      if (processRole) {
        this.blockPage = true;
        this._subscription.add(
          this.processService.deleteExecutionRole(processRole.id?.toLowerCase() || '').subscribe({
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
  }

  public showActivities(task: Execution): void {
    this.showView = 'activities';
    this.task = task;
  }

  public deleteExecution(event: boolean): void {
    if (event) {
      this._subscription.add(
        this.processService.deleteExecution(this.executionSelected.id?.toLowerCase() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.tasks = this.tasks.filter((pdt) => pdt.id?.toLowerCase() !== this.executionSelected.id?.toLowerCase());
              this.messageService.add({type: 'success', message: 'Ejecución eliminada correctamente!', life: 5000});
            }
          },
          error: (err: Error) => {
            console.error(err.message);
            this.messageService.add({type: 'error', message: 'No se pudo eliminar la ejecución!', life: 5000});
          },
        })
      );
    } else {
      this.showAlert = false;
      this.executionSelected = {
        class: "",
        description: "",
        execution_roles: [],
        id: "",
        name: "",
        queue_id: "",
        rules: [],
        timer: {},
        type: 0
      };
    }
  }

  public filterItemsTarget(event: any, dataToFilter: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name' || 'type' || 'label').split(',');
      this.tasksDisplay = this._filterService.filter(dataToFilter, searchFields, filterValue, 'contains');
    } else {
      this.tasksDisplay = this.tasks;
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

  public activeTimers(event: any): void {

    if (event === 2 || event === 1) {
      this.steps = this.steps.filter((step) => step.id !== 2);
    } else {
      if (this.steps.length === 1) {
        this.steps.push({id: 2, name: 'ROLES', active: false});
      }
    }

    if (event === 2) {
      this.taskForm.get('timer')?.setValidators([Validators.required]);
      this.taskForm.get('timer')?.updateValueAndValidity();
    } else {
      this.taskForm.get('timer')?.clearValidators();
      this.taskForm.get('timer')?.updateValueAndValidity();
    }
  }

  public backStep(): void {
    this.positionStep--;
    this.steps[this.positionStep].active = false;
  }

  public cancelCreateOrEdit(): void {
    this.showView = 'list';
    this.positionStep = 0;
    if (!this.steps.find(step => step.id === 2)) {
      this.steps.push({id: 2, name: 'ROLES', active: false});
    }
    this.steps[1].active = false;
    this.taskForm.reset();
    this.operation = 'add';
    this.executionSelected = {
      class: "",
      description: "",
      execution_roles: [],
      id: "",
      name: "",
      queue_id: "",
      rules: [],
      timer: {},
      type: 0
    };
  }

  public editExecution(execution: Execution): void {
    this.loadProcessProcessRoles(execution);
    this.executionSelected = execution;
    this.showView = 'createOrUpdate';
    this.operation = 'edit';
    this.taskForm.patchValue({
      class: execution.class,
      name: execution.name,
      type: execution.type,
      timer: execution.timer,
      description: execution.description,
    });
    if (execution.type !== 3) {
      this.steps.pop();
    }
  }

}
