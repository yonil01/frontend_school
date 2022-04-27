import {Component, Input, OnInit, OnChanges, Output, EventEmitter, OnDestroy} from '@angular/core'
import Split from 'split.js'
// Store
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {BpmState} from '@app/core/store/reducers';
// Models
import {
  Process,
  Execution,
  Rule,
  Response,
  Activity,
  Role,
  DocTypes,
  Entity,
  Project,
} from '@app/core/models';
// Services
import {ActivityService} from '@app/modules/wizard/services/activity/activity.service';
import {RoleService} from '@app/core/services/graphql/auth/role/role.service';
import {isChanged} from '@app/core/store/actions/bpm.action';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DoctypegroupService} from '@app/modules/wizard/services/doctypegroup/doctypegroup.service';
import {ProcessService} from '@app/modules/wizard/services/process/process.service';
import {v4 as uuidv4} from 'uuid';
import {EntityService} from '@app/core/services/graphql/config/entity/entity.service';
import {Subscription} from "rxjs/internal/Subscription";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";


// TODO revisar esta mierda
class Data {
  id: string;
  code: number;
  name: string;
  status?: boolean;
  child_true: number;
  child_false: number;
  first: number;
  icon: string;
  type: number;

  constructor(
    id: string,
    code: number,
    name: string,
    status: boolean,
    child_true: number,
    child_false: number,
    first: number,
    icon: string,
    type: number,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.status = status;
    this.child_true = child_true;
    this.child_false = child_false;
    this.first = first;
    this.icon = icon;
    this.type = type;
  }
}

class Node {
  label: string;
  data: Data;
  expanded: boolean = false;
  parent!: Node;
  children: Node[];
  icon?: string;

  constructor(label: string, data: Data, children: Node[], icon?: string) {
    this.label = label;
    this.data = data;
    this.children = children;
  }
}

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ActivitiesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() executionInput!: Execution;
  @Input() executions: Execution[];
  @Output() backTasks: EventEmitter<Execution> = new EventEmitter();

  private bpm!: Process;
  private execution!: Execution;
  public treeData: any[] = [];
  public node!: Node;
  public menuItems: any[] = [];
  public activities: Activity[] = [];
  public showForm: boolean = false;
  public isAnnounceDialog: boolean = false;
  public isDeleteDialog: boolean = false;
  public roles: Role[] = [];
  public docTypes: DocTypes[] = [];
  public isCreate: boolean = false;
  public currentRule!: Rule;
  private indexCurrentRule: number = 0;
  private indexExecution: number = 0;
  public entities: Entity[] = [];
  private project!: Project;

  private allActivities: Activity[] = [];
  private newRule!: Data;
  private allowConfig: boolean = false;
  private allowDelete: boolean = false;
  private allowEdit: boolean = false;
  private ICON_ACTION = 'pi pi-play color-action';
  private ICON_RULE = 'pi pi-question color-rule';
  private ICON_TRUE = 'pi pi-check-circle color-true';
  private ICON_FALSE = 'pi pi-times-circle color-false';

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;

  public isBlockPage: boolean = false;
  private splitInstance: any;

  constructor(
    private store: Store<AppState>,
    private activityService: ActivityService,
    private roleService: RoleService,
    private doctypegroupService: DoctypegroupService,
    private confirmationService: ConfirmationService,
    private processService: ProcessService,
    private messageService: ToastService,
    private entityService: EntityService,
  ) {
    this.executions = [];
    this.indexExecution = 0;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.splitInstance.destroy();
  }

  ngOnInit(): void {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.store.select('bpm').subscribe((res: BpmState) => {
      this.bpm = JSON.parse(JSON.stringify(res.bpm));
    });
    this.getData();
    this.getDataActivityForm();
    this.initSplit();
  }

  ngOnChanges(): void {
    if (this.executionInput) {
      this.execution = JSON.parse(JSON.stringify(this.executionInput));
      this.indexExecution = this.executions.findIndex((e) => e.id.toLowerCase() === this.execution.id.toLowerCase());
      this.initTree();
    }
  }

  public backTasksEvent(): void {
    this.backTasks.emit(this.execution);
  }

  private initTree(): void {
    const rule = new Data('', 1000, this.execution.name, false, 0, 0, 0, this.execution.class, 3);
    const execution = new Node(this.execution.name, rule, [], this.execution.class);
    if (this.execution.rules?.length) {
      this.getFirstNode(this.executions[this.indexExecution].rules, execution);
    } else {
      this.treeData = [execution];
    }
    this.treeData[0].expanded = true;
  }

  private getData(): void {
    this._subscription.add(
      this.activityService.getActivities().subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.allActivities = res.data;
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        },
      })
    );
  }

  private getDataActivityForm(): void {
    this.docTypes = [];
    this.isBlockPage = true;
    Promise.all([this.getDoctypeGroupsProjectId(), this.getEntitiesByProjectId(this.project.id.toLowerCase())]).then((res) => {
      const docTypeGroups = res[0];
      const entitiesProject = res[1];
      if (docTypeGroups.error) {
        this.messageService.add({type: 'error', message: docTypeGroups.msg, life: 5000});
      } else if (docTypeGroups.data) {
        docTypeGroups.data.forEach((tg: any) => {
          if (tg.doctypes) this.docTypes = this.docTypes.concat(tg.doctypes);
        });
      } else {
        this.messageService.add({type: 'info', message: 'No se encontraron tipos de documentos', life: 5000});
      }

      if (entitiesProject.error) {
        this.messageService.add({type: 'error', message: entitiesProject.msg, life: 5000});
      } else if (entitiesProject.data) {
        this.entities = entitiesProject.data;
      } else {
        this.messageService.add({type: 'info', message: 'No se encontraron entidades', life: 5000});
      }
      this.isBlockPage = false;
    })
    this._subscription.add(
      this.roleService.getRoles().subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.roles = res.data;
            }
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
          },
        }
      )
    );
  }

  private getEntitiesByProjectId(id: string): Promise<Response> {
    return new Promise<Response>((resolve, rej) => {
      this._subscription.add(
        this.entityService.getEntitiesByProject(id).subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            const error: Response = {
              error: true,
              msg: 'Error al obtener las entidades',
              data: null,
              code: 70,
              type: 'error'
            }
            resolve(error);
          },
        })
      );
    })
  }

  private getDoctypeGroupsProjectId(): Promise<Response> {
    return new Promise<Response>((resolve, rej) => {
      this._subscription.add(
        this.doctypegroupService.getDoctypeGroupsProject().subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            const error: Response = {
              error: true,
              msg: 'Error al obtener las entidades',
              data: null,
              code: 70,
              type: 'error'
            }
            resolve(error);
          },
        })
      );
    })
  }

  private getFirstNode(rules: Rule[], execution: Node): void {
    let ruled = rules.find((e: Rule) => e.first === 1);
    if (!ruled && rules?.length) {
      const rulesSorst = rules.sort((a, b) => b?.code - a?.code);
      ruled = rulesSorst[0];
    }
    if (ruled) {
      ruled.first = 1;
      const icon: string = ruled.itemtype_id === 1 ? this.ICON_ACTION : this.ICON_RULE;
      const rule = new Data(
        ruled.id || '',
        ruled.code,
        ruled.name,
        ruled.status,
        ruled.child_true,
        ruled.child_false,
        ruled.first,
        icon,
        ruled.itemtype_id,
      );
      const firstNode = new Node(ruled.name || '', rule, [], icon);
      this.buildWorkflowTree(rules, execution, firstNode);
      this.treeData = [execution];
    }
  }

  private buildWorkflowTree(rules: Rule[], parent: Node, child: Node): void {
    let childTrue, childFalse: Node;
    if (child.data.child_true) {
      const actionT = rules.find((r: Rule) => r.code === child.data.child_true);
      if (actionT) {
        const icon = actionT.itemtype_id === 1 ? this.ICON_ACTION : this.ICON_RULE;
        const activityT = new Data(actionT.id || '', actionT.code, actionT.name, actionT.status, actionT.child_true, actionT.child_false, actionT.first, icon, actionT.itemtype_id);
        childTrue = new Node(actionT?.name || '', activityT, [], icon);
        if (child.data.child_false) {
          const actionF = rules.find((r: Rule) => r.code === child.data.child_false);
          if (actionF) {
            const iconF = actionF?.itemtype_id === 1 ? this.ICON_ACTION : this.ICON_RULE;
            const activityF = new Data(actionF.id || '', actionF.code, actionF.name, actionF.status, actionF.child_true, actionF.child_false, actionF.first, iconF, actionF.itemtype_id);
            childFalse = new Node(actionF?.name || '', activityF, [], icon);
            const activityYes = new Data('', -1, 'Si', false, child.data.code, 0, 0, this.ICON_TRUE, 3);
            const yes = new Node('Si', activityYes, [], this.ICON_TRUE);
            const activityNo = new Data('', -2, 'No', false, child.data.code, 0, 0, this.ICON_FALSE, 3);
            const no = new Node('No', activityNo, [], this.ICON_FALSE);
            if (child.data.first) parent.children.push(child);
            yes.children.push(childTrue);
            no.children.push(childFalse);
            child.children.push(yes, no);
            this.buildWorkflowTree(rules, yes, childTrue);
            this.buildWorkflowTree(rules, no, childFalse);
          }
        } else {
          if (child.data.first) parent.children.push(child);
          if (child.data.type === 2) {
            const activityYes = new Data('', -1, 'Si', false, child.data.code, 0, 0, this.ICON_TRUE, 3);
            const yes = new Node('Si', activityYes, [childTrue], this.ICON_TRUE);
            const activityNo = new Data('', -2, 'No', false, child.data.code, 0, 0, this.ICON_FALSE, 3);
            const no = new Node('No', activityNo, [], this.ICON_FALSE);
            child.children.push(yes, no);
            this.buildWorkflowTree(rules, yes, childTrue);
          } else {
            parent.children.push(childTrue);
            this.buildWorkflowTree(rules, parent, childTrue);
          }
        }
      }
    } else {
      if (child.data.child_false) {
        const actionF = rules.find((r: Rule) => r.code === child.data.child_false);
        if (actionF) {
          const ICON_FALSE = actionF?.itemtype_id === 1 ? this.ICON_ACTION : this.ICON_RULE;
          const activityF = new Data(actionF.id || '', actionF.code, actionF.name, actionF.status, actionF.child_true, actionF.child_false, actionF.first, ICON_FALSE, actionF.itemtype_id);
          childFalse = new Node(actionF?.name || '', activityF, [], ICON_FALSE);
          const activityYes = new Data('', -1, 'Si', false, child.data.code, 0, 0, this.ICON_TRUE, 3);
          const yes = new Node('Si', activityYes, [], this.ICON_TRUE);
          const activityNo = new Data('', -2, 'No', false, child.data.code, 0, 0, this.ICON_FALSE, 3);
          const no = new Node('No', activityNo, [], this.ICON_FALSE);
          if (child.data.first) parent.children.push(child);
          no.children.push(childFalse);
          child.children.push(yes, no);
          this.buildWorkflowTree(rules, no, childFalse);
        }
      } else if (child.data.type === 2) {
        const activityYes = new Data('', -1, 'Si', false, child.data.code, 0, 0, this.ICON_TRUE, 3);
        const yes = new Node('Si', activityYes, [], this.ICON_TRUE);
        const activityNo = new Data('', -2, 'No', false, child.data.code, 0, 0, this.ICON_FALSE, 3);
        const no = new Node('No', activityNo, [], this.ICON_FALSE);
        child.children.push(yes, no);
        if (child.data.first === 1) parent.children.push(child);
      } else if (child.data.first === 1) parent.children.push(child);
    }
  }

  public selectNode(): void {
    this.currentRule =
      this.execution.rules && this.node ? this.execution.rules.find((a, index) => {
        this.indexCurrentRule = index;
        return a.id?.toLowerCase() === this.node.data.id.toLowerCase();
      }) || {} as Rule : {} as Rule;
    if (Object.keys(this.currentRule).length > 0) {
      this.initializeFormEdit(this.node.data.type);
    } else {
      this.showForm = false;
    }
  }

  public onContextMenu(node: Node): void {
    this.showForm = false;
    this.allowConfig = this.allowEdit = this.allowDelete = false;
    if (node.data.type === 3 && this.validateNodeHasRule(node)) {
      this.allowConfig = true;
    } else if (node.data.type === 3 && !this.validateNodeHasRule(node) && !node.data.id) {
    } else if (node.data.type === 2) {
      this.allowEdit = true;
      this.allowDelete = !node.data.child_true && !node.data.child_false;
      this.allowConfig = this.validateRuleChildren(node);
    } else if (!node.data.child_true && !node.data.child_false && node.data.type !== 3) {
      this.allowEdit = true;
      this.allowDelete = true;
    } else {
      this.allowEdit = true;
    }

    this.currentRule = this.execution.rules ? this.execution.rules.find((a, index) => {
      this.indexCurrentRule = index;
      return a.id?.toLowerCase() === node.data.id.toLowerCase();
    }) || {} as Rule : {} as Rule;
    this.menuItems = [
      {label: 'Crear Acción', icon: 'pi pi-play', visible: this.allowConfig, command: () => this.addNewItem(1)},
      {label: 'Crear Regla', icon: 'pi pi-question', visible: this.allowConfig, command: () => this.addNewItem(2)},
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        visible: this.allowEdit,
        command: () => this.initializeFormEdit(node.data.type),
      },
      {label: 'Eliminar', icon: 'pi pi-trash', visible: this.allowDelete, command: () => this.deleteActivity()},
    ];
  }

  private validateNodeHasRule(node: Node): boolean {
    const rule = node.children.find((a: Node) => a.data.type === 2);
    return !rule;
  }

  private validateRuleChildren(node: Node): boolean {
    return !node.children.length;
  }

  private addNewItem(itemType: number): void {
    this.showForm = false;
    this.activities = this.allActivities.filter((a: Activity) => a.itemtype_id === itemType);
    const icon = itemType === 1 ? this.ICON_ACTION : this.ICON_RULE;
    this.newRule = new Data('', 0, '', true, 0, 0, 0, icon, itemType);
    this.isCreate = true;
    setTimeout(() => (this.showForm = true), 200);
    // this.showForm = true;
  }

  private initializeFormEdit(itemType: number): void {
    this.showForm = false;
    this.activities = this.allActivities.filter((a: Activity) => a.itemtype_id === itemType);
    this.isCreate = false;
    setTimeout(() => {
      this.showForm = true;
    }, 200);
  }

  private deleteActivity(): void {
    this.isDeleteDialog = true;
    this.isAnnounceDialog = false;
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: `¿Está seguro de eliminar la actividad "${this.currentRule.name?.toUpperCase()}"?`,
      accept: () => {
        // this.isChanged.val = true;
        this._subscription.add(
          this.processService.deleteRuleParamsByRuleID(this.currentRule.id?.toLowerCase() || '').subscribe({
            next: (res) => {
              if (res.error) {
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this.deleteExecutionRuleQuery();
                this.messageService.add({type: 'success', message: res.msg, life: 5000});
              }
            },
            error: (err: HttpErrorResponse) => {
              console.error(err)
            },
          })
        );
      },
    });
  }

  private deleteExecutionRuleQuery(): void {
    this._subscription.add(
      this.processService.deleteExecutionRule(this.currentRule.id?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            const index = this.execution.rules.indexOf(this.currentRule);
            this.execution = JSON.parse(JSON.stringify(this.execution));
            this.execution.rules.splice(index, 1);
            const parentTrue = this.execution.rules.find((a) => a.child_true === this.currentRule.code);
            const parentFalse = this.execution.rules.find((a) => a.child_false === this.currentRule.code);
            if (parentTrue) {
              parentTrue.child_true = 0;
              this.editRule(parentTrue, false);
              const treeActivityNode = this.node.parent.children.find((n) => n.data.code === parentTrue.code);
              const indexTreeActivityNode = this.node.parent.children.findIndex((n) => n.data.code === parentTrue.code);
              if (treeActivityNode) {
                treeActivityNode.data.child_true = 0;
                this.node.parent.children[indexTreeActivityNode].data.child_true = 0;
              }
            } else if (parentFalse) {
              parentFalse.child_false = 0;
              this.editRule(parentFalse, false);
              const treeActivityNode = this.node.parent.children.find((n) => n.data.code === parentFalse.code);
              const indexTreeActivityNode = this.node.parent.children.findIndex((n) => n.data.code === parentFalse.code);
              if (treeActivityNode) {
                treeActivityNode.data.child_false = 0;
                this.node.parent.children[indexTreeActivityNode].data.child_false = 0;
              }
            }
            if (this.node.parent.data.code === -1) {
              this.node.parent.parent.data.child_true = 0;
            } else if (this.node.parent.data.code === -2) {
              this.node.parent.parent.data.child_false = 0;
            }
            const indexDelete = this.node.parent.children.findIndex((n) => n.data.code === this.node.data.code);
            this.node.parent.children.splice(indexDelete, 1);
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.showForm = false;
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err)
        },
      })
    );
  }

  public manageRuleSaved(rule: Rule): void {
    if (this.isCreate) {
      rule.itemtype_id = this.newRule.type;
      this.createRule(rule);
    } else {
      this.editRule(rule, true);
    }
    this.store.dispatch(isChanged());
  }

  private createRule(rule: Rule): void {
    switch (this.node.data.code) {
      // Opción Si de la regla
      case -1:
        this.createActivityInRuleNode(rule);
        break;
      // Opción No de la regla
      case -2:
        this.createActivityInRuleNode(rule);
        break;
      default:
        const sibling = this.node.children.find((n) => n.data.child_true === 0 && n.data.child_false === 0);
        this.createActivityInExecutionNode(rule, sibling as Node, 'child_true');
        break;
    }
  }

  private createActivityInRuleNode(executionActivity: Rule): void {
    // Si el node tiene children, se insertara la actividad como hermano del ultimo children
    if (this.node.children.length) {
      const sibling = this.node.children.find((n) => !n.data.child_true && !n.data.child_false && n.data.code !== 0);
      if (sibling) {
        this.createActivityInExecutionNode(executionActivity, sibling, 'child_true');
      }
    } else {
      // Si el node no tiene children se insertara en la opcion child_true o child_false segun corresponda
      // Opción si de la regla
      if (this.node.data.code === -1) {
        this.createActivityInExecutionNode(executionActivity, this.node.parent, 'child_true');
      } else if (this.node.data.code === -2) {
        this.createActivityInExecutionNode(executionActivity, this.node.parent, 'child_false');
      }
    }
  }

  private createActivityInExecutionNode(executionActivity: Rule, sibling: Node, child: string): void {
    let ruleUpdateChild = {};
    if (!this.execution.rules || !this.execution.rules.length) {
      executionActivity.first = 1;
      this.execution.rules = [];
      executionActivity.code = 1;
      executionActivity.id = uuidv4().toLowerCase();
      // @ts-ignore
      delete executionActivity.rule_params;
    } else {
      const maxActivityID = Math.max.apply(Math, this.execution.rules.map((a) => a.code));
      executionActivity.id = uuidv4().toLowerCase();
      executionActivity.code = maxActivityID + 1;
      const index = this.execution.rules.findIndex((a) => a.code === sibling.data.code);
      this.execution = JSON.parse(JSON.stringify(this.execution));
      // @ts-ignore
      this.execution.rules[index][child] = executionActivity.code;
      ruleUpdateChild = JSON.parse(JSON.stringify(this.execution.rules[index]));
    }

    executionActivity.execution_id = this.execution.id.toLowerCase();
    executionActivity.description = 'descripcion rule';
    const activity = JSON.parse(JSON.stringify(executionActivity));
    // @ts-ignore
    delete executionActivity.params;
    this.isBlockPage = true;
    const data: any = executionActivity;
    delete data.rule_params;
    this._subscription.add(
      this.processService.createExecutionRule(data).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.execution.rules.push(JSON.parse(JSON.stringify(activity)));
            this.saveParams(activity);
            if (Object.keys(ruleUpdateChild).length > 0) this.editRule(ruleUpdateChild as Rule, false);
            // Tree Data Update
            this.newRule.id = executionActivity.id || '';
            this.newRule.code = executionActivity.code || 0;
            this.newRule.name = executionActivity.name || '';
            this.newRule.status = executionActivity.status;
            const newChildren = [];
            // Si la actividad es tipo regla se agrega por defecto opciones si y no de lo contrario children = []
            if (this.newRule.type === 2) {
              const activityYes = new Data('', -1, 'Si', false, this.newRule.code, 0, 0, this.ICON_TRUE, 3);
              const yes = new Node('Si', activityYes, [], this.ICON_TRUE);
              const activityNo = new Data('', -2, 'No', false, this.newRule.code, 0, 0, this.ICON_FALSE, 3);
              const no = new Node('No', activityNo, [], this.ICON_FALSE);
              newChildren.push(yes, no);
            }
            const newNode: Node = new Node(this.newRule.name, this.newRule, newChildren);
            this.node.children.push(newNode);
            if (this.node) {
              if (this.node.children.length >= 2) {
                this.node.children[this.node.children.length - 2].data.child_true = newNode.data.code;
              } else if (this.node.data.code === -1) {
                this.node.parent.data.child_true = newNode.data.code;
              } else if (this.node.data.code === -2) {
                this.node.parent.data.child_false = newNode.data.code;
              }
            }
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.showForm = false;
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockPage = false;
          this.messageService.add({type: 'error', message: err.message, life: 5000});
          console.error(err)
        },
      })
    );
  }

  private editRule(ruleParam: Rule, isSaveParams: boolean): void {
    const activity = JSON.parse(JSON.stringify(ruleParam));
    const rule = JSON.parse(JSON.stringify(ruleParam));
    delete rule.params;
    delete rule.rule_params;
    rule.id = rule.id?.toLowerCase();
    rule.execution_id = this.execution.id.toLowerCase();
    this.isBlockPage = true;
    this._subscription.add(
      this.processService.updateExecutionRule(rule).subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (isSaveParams) this.saveParams(activity);
            const index = this.execution.rules.findIndex((r) => r.id?.toLowerCase() === rule.id?.toLowerCase());
            this.execution = JSON.parse(JSON.stringify(this.execution));
            this.execution.rules[index] = activity;
            if (this.node.data?.code > 0) {
              this.node.data.name = rule.name || '';
              this.node.label = rule.name || '';
              this.node.data.status = rule.status;
            }
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.showForm = false;
          }
          this.isBlockPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockPage = false;
          this.messageService.add({type: 'error', message: err.message, life: 5000});
          console.error(err)
        },
      })
    );
  }

  private saveParams(activity: Rule): void {
    for (const param of activity.params) {
      let index: number = 0;
      const paramCurrent = this.currentRule?.rule_params?.find((rp, i) => {
        index = i;
        return rp.name === param.name;
      });
      if (paramCurrent) {
        if (paramCurrent.value !== param.value) {
          param.id = paramCurrent.id.toLowerCase();
          param.rule_id = activity.id?.toLowerCase();
          this._subscription.add(
            this.processService.updateRuleParams(param).subscribe({
              next: (res) => {
                if (res.error) {
                  this.messageService.add({type: 'error', message: res.msg, life: 5000});
                } else {
                  this.execution.rules[this.indexCurrentRule].rule_params[index] = param;
                  this.messageService.add({type: 'success', message: res.msg, life: 5000});
                }
              },
              error: (err: HttpErrorResponse) => {
                console.error(err);
                this.messageService.add({type: 'error', message: err.message, life: 5000});
              },
            })
          );
        }
      } else {
        param.id = uuidv4().toLowerCase();
        param.rule_id = activity.id?.toLowerCase();
        param.value = param.value?.toString();
        this._subscription.add(
          this.processService.createRuleParams(param).subscribe({
            next: (res) => {
              if (res.error) {
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                if (!this.execution.rules[this.execution.rules.length - 1].rule_params) {
                  this.execution.rules[this.execution.rules.length - 1].rule_params = [];
                }
                this.execution.rules[this.execution.rules.length - 1]?.rule_params?.push(param);
                this.messageService.add({type: 'success', message: res.msg, life: 5000});
              }
            },
            error: (err: HttpErrorResponse) => {
              console.error(err);
              this.messageService.add({type: 'error', message: err.message, life: 5000});
            },
          })
        );
      }
    }
  }

  public initSplit(): void {
    this.splitInstance = Split(['.one', '.two'], {
      sizes: [50, 50],
      direction: 'vertical',
      minSize: [0, 0]
    });
  }

}
