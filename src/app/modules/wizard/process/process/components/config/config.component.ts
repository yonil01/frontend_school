import {Component, Input, OnInit, OnChanges, OnDestroy} from '@angular/core';
import {Execution, Role, Queue, ExecutionRole} from '@app/core/models';
import {FormBuilder} from '@angular/forms';
import {RoleService} from '@app/core/services/graphql/auth/role/role.service';
import {ProcessService} from '@app/modules/wizard/services/process/process.service';
import {ToastService} from "ecapture-ng-ui";
import {FilterService} from "@app/ui/services/filter.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnChanges, OnDestroy {

  @Input('queue-selected') parentQueue!: Queue;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  private _subscription: Subscription = new Subscription();

  public showView: string = 'list';
    public typeTask: string = 'SYSTEM';
  public tasks: Execution[] = [];
  public tasksDisplay: Execution[] = [];
  public tasksPagination: Execution[] = [];
  public selectionRoles: Role[] = [];
  public roles: Role[] = [];
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
      this.tasksDisplay = this.getTaskByType();
    }
  }

  private getRoles(): void {
    /*this._subscription.add(
      this.roleService.getRoles().subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.roles = res.data;
            if (this.parentQueue.id) this.preloadRoles();
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this.messageService.add({type: 'error', message: 'No se pudo obtener el listado de roles!', life: 5000});
        }
      })
    );*/
  }

  private preloadRoles(): void {
    this.selectionRoles = this.parentQueue.queue_roles ? this.roles.filter((rl) => this.parentQueue.queue_roles?.find((rq) => rq?.role.id.toLowerCase() === rl.id?.toLowerCase())) : [];
  }

  public backTasks(task: any): void {
    if (task) {
      const indexTask = this.tasks.findIndex((t) => t.id?.toLowerCase() === this.executionSelected.id?.toLowerCase());
      this.tasks[indexTask] = JSON.parse(JSON.stringify(task));
      this.showView = 'list';
    }
  }

  public showActivities(task: Execution): void {
    this.showView = 'activities';
    this.executionSelected = task;
  }

  public deleteExecution(event: boolean): void {
    if (event) {
      this.showAlert = false;
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

  public filterTasks(event: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const tasks = this.getTaskByType();
      const searchFields: string[] = ('name' || 'type' || 'label').split(',');
      this.tasksDisplay = this._filterService.filter(tasks, searchFields, filterValue, 'contains');
    } else {
      this.tasksDisplay = this.getTaskByType();
    }
  }

  public cancelCreateOrEdit(): void {
    this.showView = 'list';
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
    this.executionSelected = execution;
    this.showView = 'createOrUpdate';
  }

  public setTypeTask(typeTask: string): void {
    switch (typeTask) {
      case 'system':
        this.typeTask = 'SYSTEM';
        break;
      case 'timer':
        this.typeTask = 'TIMER';
        break;
      default:
        this.typeTask = 'USER';
    }
    this.showView = 'list';
    this.tasksDisplay = this.getTaskByType();
  }

  public getTaskByType(): Execution[] {
    switch (this.typeTask) {
      case 'SYSTEM':
        return this.tasks.filter((task => task.type === 1));
      case 'TIMER':
        return this.tasks.filter((task => task.type === 2));
      default:
        return this.tasks.filter((task => task.type === 3));
    }
  }

  public saveTask(task: Execution): void {
    const indexExecution = this.tasks.findIndex((t) => t.id?.toLowerCase() === task.id?.toLowerCase());
    if (indexExecution !== -1) {
      this.tasks[indexExecution] = task;
    } else {
      this.tasks.push(task);
    }
    this.tasksDisplay = this.getTaskByType();
  }

  public saveExecutionRole(executionRole: ExecutionRole): void {
    const indexExecution = this.tasks.findIndex((r) => r.id?.toLowerCase() === this.executionSelected.id?.toLowerCase());
    if (indexExecution !== -1) {
      this.tasks[indexExecution]?.execution_roles?.push(executionRole);
    }
  }

  public deleteRoleTask(task: Execution): void {
    const indexExecution = this.tasks.findIndex((r) => r.id?.toLowerCase() === task.id?.toLowerCase());
    if (indexExecution !== -1) {
      this.tasks[indexExecution].execution_roles = this.executionSelected.execution_roles;
    }
  }

  public createTask(): void {
    this.showView = 'createOrUpdate';
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
