import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Execution, Role, Queue, ExecutionRole} from '@app/core/models';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {RoleService} from '@app/core/services/graphql/auth/role/role.service';
import {ProcessService} from '@app/modules/wizard/services/process/process.service';
import {v4 as uuidv4} from 'uuid';
import {ToastService} from "ecapture-ng-ui";
import {FilterService} from "@app/ui/services/filter.service";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnChanges {
  @Input('queue-selected') parentQueue!: Queue;
  taskTableColumns: any[];
  selectionTask!: Execution;
  taskForm: FormGroup;
  tasks: Execution[] = [];
  tasksDisplay: Execution[] = [];
  icons: any[] = [];
  selectionRoles: Role[] = [];
  selectedRolesForm = new FormControl([]);
  selectedRolesBefore: Role[] = [];
  roles: Role[] = [];
  view: string;
  typeTask: number = 0;
  operation: string = '';
  typesTasks: any[] = [];
  task!: Execution;
  indexTask: number = 0;
  rolesAvailable: Role[];
  rolesSelected: Role[];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private processService: ProcessService,
    private messageService: ToastService,
    private _filterService: FilterService
  ) {
    this.taskTableColumns = [
      {field: 'name', header: 'Nombre'},
      {field: 'type', header: 'Tipo tarea'},
    ];
    this.taskForm = fb.group({
      class: [null, Validators.required],
      name: [null, Validators.required],
      type: [null, Validators.required],
      description: [null, Validators.required],
    });
    this.view = 'tasks';
    this.typesTasks = [
      {id: 1, name: 'Sistema'},
      {id: 3, name: 'Usuario'},
      {id: 2, name: 'Timer'},
    ];
    this.rolesSelected = [];
    this.rolesAvailable = [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.parentQueue) {
      this.getRoles();
      const taskFind = this.parentQueue.executions ? this.parentQueue.executions : [];
      this.tasks = taskFind;
      this.tasksDisplay = taskFind
    }
  }

  private getRoles(): void {
    this.roleService.getRoles().subscribe((res) => {
      this.roles = res.data;
      if (this.parentQueue.id) this.preloadRoles();
    });
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
      const taskValue: Execution = JSON.parse(JSON.stringify(task));
      delete taskValue.id;
      delete taskValue.queue_id;
      delete taskValue.rules;
      delete taskValue.execution_roles;
      this.taskForm.setValue(taskValue);
      const typeTasc = this.typesTasks.find((tt) => tt.id === taskValue.type);
      this.taskForm.get('type')?.setValue(typeTasc);
      this.taskForm.get('type')?.disable();
      const selectRoles = task.execution_roles ? this.selectionRoles.filter((sr) => task.execution_roles?.find((er) => er.role?.id?.toLowerCase() === sr.id?.toLowerCase())) : [];
      this.selectedRolesForm.setValue(selectRoles);
      this.selectedRolesBefore = selectRoles;
    } else {
      this.operation = 'add';
      this.taskForm.reset();
      this.taskForm.get('type')?.enable();
    }
    this.view = 'task';
  }

  selectTypeTask(value: any): void {
    this.typeTask = value.id;
  }

  backTasks(task: any): void {
    if (task) {
      this.typeTask = 0;
      const indexTask = this.tasks.findIndex((t) => t.id?.toLowerCase() === this.task.id?.toLowerCase());
      this.tasks[indexTask] = JSON.parse(JSON.stringify(task));
    }
    this.view = 'tasks';
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

  saveTask(): void {
    if (this.operation === 'add') {
      const execution: Execution = {
        ...this.taskForm.value,
        id: uuidv4().toLowerCase(),
        queue_id: this.parentQueue.id?.toLowerCase(),
        type: this.typeTask,
      };
      this.processService.createExecution(execution).subscribe((res) => {
        if (!res.error) {
          execution.execution_roles = [];
          this.task = execution;
          this.tasks.push(execution);
          this.indexTask = this.tasks.length - 1;
          this.notifyUser('success', '', res.msg, 6000);
          if (this.typeTask !== 3) this.view = 'tasks';
        } else {
          this.notifyUser('error', '', res.msg, 6000);
        }
      });
    } else {
      const execution: Execution = {
        ...this.taskForm.value,
        id: this.task.id?.toLowerCase(),
        queue_id: this.parentQueue.id?.toLowerCase(),
        type: this.typeTask,
      };
      this.processService.updateExecution(execution).subscribe((res) => {
        if (!res.error) {
          this.tasks[this.indexTask].execution_roles = this.task.execution_roles;
          if (this.typeTask !== 3) this.view = 'tasks';
        }
      });
    }
  }

  private loadProcessProcessRoles(task: Execution): void {
    this.rolesSelected = [];
    this.rolesAvailable = [];
    if (task) {
      for (const r of this.roles) {
        if (task.execution_roles?.find((pdt) => pdt?.role?.id?.toLowerCase() === r.id?.toLowerCase())) {
          this.rolesSelected.push(r);
        } else {
          this.rolesAvailable.push(r);
        }
      }
    } else {
      this.rolesAvailable = JSON.parse(JSON.stringify(this.roles));
    }
  }

  onMoveToSelectedRoles(roles: Role[]): void {
    for (const role of roles) {
      const processRole: ExecutionRole = {
        id: uuidv4().toLowerCase(),
        execution_id: this.task.id?.toLowerCase(),
        role_id: role.id?.toLowerCase(),
      };
      const currentProcessRole = JSON.parse(JSON.stringify(processRole));
      currentProcessRole.role = role;
      this.processService.createExecutionRole(processRole).subscribe((res) => {
        if (res.error) {
          this.notifyUser('error', '', res.msg, 5000);
        } else {
          this.notifyUser('success', '', res.msg, 5000);
          this.tasks[this.indexTask].execution_roles = this.tasks[this.indexTask].execution_roles
            ? this.tasks[this.indexTask].execution_roles
            : [];
          this.tasks[this.indexTask].execution_roles?.push(currentProcessRole);
        }
      });
    }
  }

  onMoveToAvailableRoles(roles: Role[]): void {
    const processRoles: ExecutionRole[] = [];
    for (const dt of roles) {
      const processRole = this.task.execution_roles?.find((pdt) => pdt?.role?.id?.toLowerCase() === dt.id?.toLowerCase());
      if (processRole) {
        processRoles.push(processRole);
      }
    }
    for (const prl of processRoles) {
      this.processService.deleteExecutionRole(prl.id?.toLowerCase() || '').subscribe((res) => {
        if (res.error) {
          this.notifyUser('error', '', res.msg, 5000);
        } else {
          this.notifyUser('success', '', res.msg, 5000);
          this.tasks[this.indexTask].execution_roles = this.tasks[this.indexTask].execution_roles?.filter((pdt) => pdt.id?.toLowerCase() !== prl.id?.toLowerCase());
        }
      });
    }
  }

  showActivities(task: Execution): void {
    this.view = 'activities';
    this.task = task;
  }

  deleteExecution(task: Execution, index: number): void {
    this.processService.deleteExecution(task.id?.toLowerCase() || '').subscribe((res) => {
      if (!res.error) {
        this.tasks.splice(index, 1);
        this.notifyUser('success', '', res.msg, 6000);
      } else {
        this.notifyUser('error', '', res.msg, 6000);
      }
    });
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

  private notifyUser(severity: string, summary: string, detail: string, life: number): void {
    this.messageService.add({
      type: severity,
      message: detail,
      life: life,
    });
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

}
