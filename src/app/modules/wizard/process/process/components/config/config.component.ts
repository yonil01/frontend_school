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
  selectionTask!: Execution;
  public taskForm: FormGroup;
  public tasks: Execution[] = [];
  public tasksDisplay: Execution[] = [];
  public tasksPagination: Execution[] = [];
  icons: any[] = [];
  public selectionRoles: Role[] = [];
  selectedRolesForm = new FormControl([]);
  selectedRolesBefore: Role[] = [];
  public roles: Role[] = [];
  public rolesDisplay: RolesDisplay[] = [];
  public rolesPagination: RolesDisplay[] = [];
  typeTask: number = 0;
  public operation: string = 'add';
  public typesTasks: any[] = [];
  task!: Execution;
  indexTask: number = 0;
  public rolesAvailable: RolesDisplay[];
  rolesSelected: Role[];
  public timers: DataDrop[] = [
    {value: 1, label: 'Notificar solicitud recibida'},
    {value: 2, label: 'Crear template'},
    {value: 3, label: 'Completitud documental'},
    {value: 5, label: 'Timer Execution'},
    {value: 35, label: 'Timer Execution daily'}
  ];
  public steps: StepModel[] = [
    {id: 1, name: 'GENERAL_INFORMATION', active: true},
    {id: 2, name: 'ROLES', active: false}
  ];

  public executionSelected!: Execution;
  public showAlert: boolean = false;
  public blockPage: boolean = false;

  public showTaskManager: string = 'list';

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
      timer: [''],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8000)]],
    });
    // TODO cargar desde el api
    this.typesTasks = [
      {value: 1, label: 'Sistema'},
      {value: 3, label: 'Usuario'},
      {value: 2, label: 'Timer'},
    ];
    this.rolesSelected = [];
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

  showTask(task: Execution, index: number): void {
    this.loadProcessProcessRoles(task);
    if (task) {
      this.task = task;
      this.indexTask = index;
      this.operation = 'edit';
      this.typeTask = task.type || 0;
      const taskValue = JSON.parse(JSON.stringify(task));
      delete taskValue.id;
      delete taskValue.queue_id;
      delete taskValue.rules;
      delete taskValue.execution_roles;
      this.taskForm.setValue(taskValue);
      const typeTasc = this.typesTasks.find((tt) => tt.value === taskValue.type);
      this.taskForm.get('type')?.setValue(typeTasc);
      this.taskForm.get('type')?.disable();
      //const selectRoles = task.execution_roles ? this.selectionRoles.filter((sr) => task.execution_roles?.find((er) => er.role?.id?.toLowerCase() === sr.id?.toLowerCase())) : [];
      // this.selectedRolesForm.setValue(selectRoles);
      // this.selectedRolesBefore = selectRoles;
    } else {
      this.operation = 'add';
      this.taskForm.reset();
      this.taskForm.get('type')?.enable();
    }
  }

  selectTypeTask(value: any): void {
    this.typeTask = value.id;
  }

  backTasks(task: any): void {
    if (task) {
      this.typeTask = 0;
      const indexTask = this.tasks.findIndex((t) => t.id?.toLowerCase() === this.task.id?.toLowerCase());
      this.tasks[indexTask] = JSON.parse(JSON.stringify(task));
      this.showView = 'list';
    }
  }

  selectRoles(event: any): void {
    if (this.operation === 'edit') {
      if (event.value.length > this.selectedRolesBefore.length) {
        const executionRolePersistense: ExecutionRole = {
          id: uuidv4().toLowerCase(),
          execution_id: this.task.id?.toLowerCase(),
          role_id: event.itemValue.id.toLowerCase(),
        };
        this.processService.createExecutionRole(executionRolePersistense).subscribe((res) => {
          if (!res.error) {
            this.selectedRolesBefore = event.value;
            executionRolePersistense.role = event.itemValue;
            this.task.execution_roles = this.task.execution_roles ? this.task.execution_roles : [];
            this.task.execution_roles.push(executionRolePersistense);
          }
        });
      } else {
        const executionRole = this.task.execution_roles?.find((er) => er?.role?.id?.toLowerCase() === event.itemValue.id.toLowerCase());
        if (executionRole) {
          this.processService.deleteExecutionRole(executionRole?.id?.toLowerCase() || '').subscribe((res) => {
            if (!res.error) this.selectedRolesBefore = event.value;
            this.task.execution_roles = this.task.execution_roles?.filter((er) => er?.role?.id?.toLowerCase() !== executionRole?.role?.id?.toLowerCase());
          });
        }
      }
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
                this.positionStep++;
                execution.execution_roles = [];
                this.task = execution;
                this.executionSelected = execution;
                this.tasks.push(execution);
                this.indexTask = this.tasks.length - 1;
                this.messageService.add({type: 'success', message: 'Ejecuión creada correctamente!', life: 5000});
                this.steps[this.positionStep].active = true;
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

  confirmDeleteDataset(task: Execution, index: number) {
    /*this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la tarea ${task.name}?`,
      header: 'Confirmar Eliminación Tarea',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteExecution(task, index);
      },
      reject: () => {},
    });*/
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
    this.showView = 'editOrCreate';
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