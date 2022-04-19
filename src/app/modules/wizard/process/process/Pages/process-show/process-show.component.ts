import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Document, Execution, Process, Queue, Response} from "@app/core/models";
import {ActivatedRoute, Router} from "@angular/router";
import {ProcessService} from "@app/modules/wizard/services/process/process.service";
import {ToastService} from "ecapture-ng-ui";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {DocumentService} from "@app/core/services/graphql/doc/document/document.service";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";

// @ts-ignore
import CustomRulesModules from '../../rules';

// @ts-ignore
import * as BpmnJSViewer from 'bpmn-js/dist/bpmn-viewer.production.min.js';
// @ts-ignore
import * as BpmnJSModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import {controlBpm, controlElement, controlSide, controlTask} from "@app/core/store/actions/bpm.action";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {MatMenuTrigger} from "@angular/material/menu";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-process-show',
  templateUrl: './process-show.component.html',
  styleUrls: ['./process-show.component.scss']
})
export class ProcessShowComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(MatMenuTrigger, {static: true}) contextMenu!: MatMenuTrigger;
  @ViewChild('bpmn', {static: true}) private elementBpmn!: ElementRef;
  @ViewChild('configContainer', {read: ViewContainerRef}) configContainer!: ViewContainerRef;

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockedPage: boolean = false;
  public showOptions: boolean = false;

  public bpm: Process = {};
  public versions: any[] = [];
  public isShowVersions = false;
  public versionBpm: any;
  public isChangedVersion = false;
  public queueSelected: Queue = {
    ans: 0,
    balance_type: 0,
    class: "",
    comments: [],
    description: "",
    entities: [],
    executions: [],
    id: "",
    id_bpmn_element: "",
    must_confirm_comment: false,
    name: "",
    percent_alert: 0,
    process_id: "",
    queue_attributes: [],
    queue_roles: [],
    roles: [],
    sequences: 0,
    status: 0,
    type: 0
  };
  public execution: Execution = {
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
  public isProcessLocked: boolean = false;
  public isReloading: boolean = false;
  public currentElement: any;
  public isDeleteDialog: boolean = false;
  public isAnnounceDialog: boolean = false;
  public isPublishDialog: boolean = false;
  public existQueue: boolean = false;
  public showSide: boolean = false;
  public isChanged = {val: false};
  public contextMenuPosition: any;
  public viewSide: string = '';
  private bpmnJS: BpmnJSModeler = new BpmnJSModeler();
  private bpmnXML: string = '';
  private elementAdded: boolean = false;
  public showMenu: boolean = false;
  public showConfirm: boolean = false;
  public showConfirmExit: boolean = false;
  public showConfirmDeleteQueue: boolean = false;
  private queueDelete!: Queue;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private processService: ProcessService,
    private cfr: ComponentFactoryResolver,
    private store: Store<AppState>,
    private documentService: DocumentService,
    private localStorage: LocalStorageService,
    private messageService: ToastService,
  ) {
    this.contextMenuPosition = {x: '0px', y: '0px'};
    this.store.select('bpm').subscribe((res) => {
      this.bpm = JSON.parse(JSON.stringify(res.bpm));
      this.showSide = res.showSide;
      if (!this.bpm || Object.keys(this.bpm).length === 0) this.router.navigateByUrl('wizard/bpmn');
    });
  }

  ngOnInit(): void {
    this.avoidContextMenu();
    this.isBlockedPage = true;
    this._subscription.add(
      this.processService.getProcessByID(this.bpm.id?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (res.data) {
              this.bpm = res.data;
              this.getBpmVersions(this.bpm);
              this.getDiagram();
              this.initLockUnlockBpm();
            } else {
              this.messageService.add({type: 'error', message: 'No se encontró el proceso', life: 5000});
            }
          }
          this.isBlockedPage = false;
        },
        error: (err: Error) => {
          this.isBlockedPage = false;
          console.error(err.message);
          this.messageService.add({
            type: 'error',
            message: 'Hubo un error a la hora de cargar el proceso seleccionado',
            life: 5000
          });
        },
      })
    );
    this.bpmnJS.on('import.done', ({error}: any) => {
      if (!error) this.bpmnJS.get('canvas').zoom('fit-viewport');
    });
    this.currentElement = null;
  }

  private selectedVersion(bpm: Process): void {
    this.currentElement = null;
    if (bpm) {
      this.isChangedVersion = true;
      if (!this.bpm.is_locked) this.unlockBpmnDiagram();
      this._subscription.add(
        this.processService.getProcessByID(bpm.id?.toLowerCase() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.bpm = res.data;
              this.getDiagram();
              this.initLockUnlockBpm();
              const bpmnFind = this.versions.find((IBpmn) => this.bpm.id === IBpmn.id);
              if (bpmnFind) {
                this.versionBpm = bpmnFind;
              }
            }
          },
          error: (err: Error) => {
            console.error(err.message);
            this.messageService.add({
              type: 'error',
              message: 'Hubo un error a la hora de cargar el proceso seleccionado',
              life: 5000
            });
          },
        })
      );
      this.bpmnJS.on('import.done', ({error}: any) => {
        if (!error) this.bpmnJS.get('canvas').zoom('fit-viewport');
      });
    }
  }

  private loadProcess(): void {
    this.isBlockedPage = true;
    this._subscription.add(
      this.processService.getProcessByID(this.bpm.id?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            if (res.data) {
              this.bpm = res.data;
              this.store.dispatch(controlBpm({bpm: this.bpm}));
            } else {
              this.messageService.add({message: 'No se encontró el proceso', type: 'error', life: 5000});
            }
          }
          this.isBlockedPage = false;
        },
        error: (err: Error) => {
          console.error(err.message);
          this.isBlockedPage = false;
          this.messageService.add({
            message: 'Ocurrio un problema cuando se trajo el proceso!',
            type: 'error',
            life: 5000
          });
        },
      })
    );
  }

  private getBpmVersions(bpm: Process) {
    this._subscription.add(
      this.processService.getProcessByProcessRootID(bpm.process_root?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            if (res.data) {
              this.versions = res.data.map((bpmn: any) => ({...bpmn, version: 'Versión: ' + bpmn.version}));
              this.versionBpm = this.versions.find((bpmn: any) => this.bpm.id === bpmn.id);
            } else {
              this.messageService.add({
                message: 'No se encontró las versiones del proceso!',
                type: 'error',
                life: 5000
              });
            }
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this.messageService.add({
            message: 'Ocurrio un problema cuando se trajo las versiones del proceso seleccionado!',
            type: 'error',
            life: 5000
          });
        },
      })
    );
  }

  private updateNameBpm(name: string): void {
    const modeling = this.bpmnJS.get('modeling');
    modeling.updateProperties(this.currentElement, {
      name: name,
    });
  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(this.elementBpmn.nativeElement);
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
    this._subscription.unsubscribe();
  }

  private writeBpmInState(bpm: Process): void {
    this.store.dispatch(controlBpm({bpm: bpm}));
  }

  private getDiagram(): void {
    if (this.bpm.document_id_bpmn) {
      this.writeBpmInState(this.bpm);
      this.getBpmnDiagram(this.bpm.document_id_bpmn);
    } else {
      this.getDefaultDiagram();
    }
  }

  private getBpmnDiagram(documentID: string) {
    this._subscription.add(
      this.documentService.getDocumentByID(documentID).subscribe({
        next: (resp) => {
          if (resp.error) {
            this.messageService.add({message: resp.msg, type: 'error', life: 5000});
          } else {
            const xml = atob(resp.data.file_encode);
            this.bpmnXML = xml;
            this.importDiagram(xml);
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this.messageService.add({
            message: 'Ocurrio un problema cuando se trajo el diagrama del proceso!',
            type: 'error',
            life: 5000
          });
        },
      })
    );
  }

  private getDefaultDiagram() {
    this.processService.getDefaultBPMN().then((res: any) => {
      res.getElementById('def').setAttribute('name', this.bpm.name);
      this.bpmnXML = new XMLSerializer().serializeToString(res);
      this.importDiagram(this.bpmnXML);
    });
  }

  private initLockUnlockBpm(): void {
    if (!this.bpm.is_locked || this.validateSessionLockedELS()) {
      this.lockBpmnDiagram();
      this.initModelerBPMN();
    } else if (this.bpm.is_locked) {
      const userLocked = this.bpm.locked_info?.split('|')[1];
      this.initViewerBPMN();
      this.isProcessLocked = true;
      this.messageService.add({
        type: 'warning',
        message: `El Modelo está bloqueado por el usuario ${userLocked} en otra sesión`,
        life: 5000
      });
    } else {
      this.isProcessLocked = false;
      this.initModelerBPMN();
    }
  }

  private async importDiagram(xml: any) {
    await this.bpmnJS.importXML(xml);
  }

  private initModelerBPMN(): void {
    console.log(CustomRulesModules);
    this.bpmnJS.destroy();
    // TODO window.processELS = this.processELS;
    this.bpmnJS = new BpmnJSModeler({
      keyboard: {bindTo: document},
      additionalModules: [CustomRulesModules],
    });
    this.initializeBpmnEvents();
    this.bpmnJS.attachTo(this.elementBpmn.nativeElement);
    this.importDiagram(this.bpmnXML);
  }

  private initViewerBPMN(): void {
    this.bpmnJS.destroy();
    this.bpmnJS = new BpmnJSViewer();
    this.avoidContextMenu();
    this.bpmnJS.attachTo(this.elementBpmn.nativeElement);
    this.importDiagram(this.bpmnXML);
  }

  /**
   * BPMN Diagram Events initilization
   */
  private initializeBpmnEvents() {
    this.bpmnJS.on('commandStack.changed', () => this.stackElement());
    this.bpmnJS.on('element.changed', (event: any) => this.changeElement(event));
    this.bpmnJS.on('shape.added', (event: any) => this.addElement(event));
    this.bpmnJS.on('element.click', (event: any) => this.clickElement(event));
    this.bpmnJS.on('shape.remove', (event: any) => this.removeElement(event));
    this.bpmnJS.on('element.contextmenu', (event: any) => this.openMenu(event));
    this.bpmnJS.on('element.dblclick', 10000, function () {
      return false;
    });
  }

  private stackElement(): void {
    this.isChanged.val = true;
  }

  private changeElement(event: any): void {
    this.isChanged.val = true;
  }

  private addElement(event: any): void {
    if (!this.bpmnXML.includes(event.element.id) && event.element.id.substr(-5) !== 'label') {
      this.isChanged.val = true;
      this.elementAdded = true;
      if (event.element.type.substr(-4) === 'Task') {
        this.currentElement = event.element;
      }
    }
    if (!this.isReloading)
      if (event.element.type.substr(-4) === 'Task') {
      }
  }

  private async clickElement(event: any) {
    this.elementAdded = false;
    // Referencia del diagrama en caso de ser necesario reconstruirlo (cuando se elimina queue con referencias en actividades)
    // this.bpmnJS.saveXML({format: true}, (err: any, xml: any) => (this.bpmnXML = xml));
    const result = await this.bpmnJS.saveXML({format: true});
    this.bpmnXML = result.xml;
    this.currentElement =
      event.element.type.indexOf('Task') > -1 ||
      event.element.type.indexOf('IntermediateCatchEvent') > -1 ||
      event.element.type.indexOf('Gateway') > -1 ? event.element : null;
  }

  private removeElement(event: any) {
    if (this.currentElement && !this.elementAdded) {
      if (
        event.element.type.indexOf('Task') > -1 ||
        event.element.type.indexOf('IntermediateCatchEvent') > -1 ||
        event.element.type.indexOf('Gateway') > -1
      ) {
        this.isAnnounceDialog = false;
        this.isDeleteDialog = true;
        this.showConfirmDeleteQueue = true;
        this.queueDelete = event;
      }
    } else if (!this.elementAdded) {
      // TODO History
      // const history = new HistoryBPMN(null, null, null, null, null, null, null, event.element.id);
      // this.addHistoryRegister(history, 'eel');
    }
  }

  private deleteQueue(event: any): void {
    const index = this.bpm.queues?.findIndex((q: Queue) => q.id_bpmn_element === event.element.id);
    if (index && index > -1) {
      // @ts-ignore
      const queueE = this.bpm.queues[index];
      if (queueE) {
        if (queueE.executions?.length) {
          this.initModelerBPMN();
          this.messageService.add({
            type: 'waning',
            message: 'No se puede eliminar, hay ejecuciones relacionadas.',
            life: 5000
          });
          return;
        }
        if (queueE.queue_attributes?.length) {
          this.initModelerBPMN();
          this.messageService.add({
            type: 'waning',
            message: 'No se puede eliminar, hay atributos relacionados.',
            life: 5000
          });
          return;
        }
        if (queueE.queue_roles?.length) {
          this.initModelerBPMN();
          this.messageService.add({
            type: 'waning',
            message: 'No se puede eliminar, hay roles relacionados.',
            life: 5000
          });
          return;
        }
        const {queue, activity} = this.validateHasQueueReferences(queueE);
        if (activity) {
          this.initModelerBPMN();
          this.messageService.add({
            type: 'waning',
            message: `No se puede eliminar la cola de proceso porque es referenciada en: Cola de proceso: ${queue} Actividad: ${activity} Para continuar debe actualizar la referencia.`,
            life: 5000
          });
          return;
        }
        // TODO
        // const executions = queueE && queueE.executions ? JSON.stringify(queueE.executions) : null;
        // const history = new HistoryBPMN(null, null, event.element.id, JSON.stringify(queueE), null, executions, null, event.element.id);
        // const succcessHistoryReg = this.addHistoryRegister(history, 'equ');
        // if (!succcessHistoryReg) return;
        this.isBlockedPage = true;
        this._subscription.add(
          this.processService.deleteQueue(queueE.id?.toLowerCase() || '').subscribe({
            next: (res) => {
              if (res.error) {
                this.initModelerBPMN();
                this.messageService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this.messageService.add({type: 'success', message: res.msg, life: 5000});
                this.bpm.queues?.splice(index, 1);
                this.updateBpm();
                this.store.dispatch(controlBpm({bpm: this.bpm}));
              }
            },
            error: (err: HttpErrorResponse) => {
              this.initModelerBPMN();
              this.isBlockedPage = false;
              console.error(err);
              this.messageService.add({type: 'error', message: err.message, life: 5000});
            },
          })
        );
      }
    }
    this.isChanged.val = true;
  }

  private validateHasQueueReferences(queue: Queue): any {
    let resp: object;
    if (this.bpm.queues) {
      for (const q of this.bpm.queues) {
        if (q.executions) {
          for (const e of q.executions) {
            if (e.rules) {
              for (const a of e.rules) {
                if (a.params?.length) {
                  for (const p of a.params) {
                    if (p.value === queue.name) {
                      resp = {queue: q.name, execution: e.name, activity: a.name};
                      return resp;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return {queue: null, execution: null, activity: null};
  }

  private async openMenu(event: any) {
    event.originalEvent.preventDefault();
    event.originalEvent.stopPropagation();
    this.existQueue = false;
    const type = event.element.type;
    if (type.indexOf('Task') > -1 || type.indexOf('IntermediateCatchEvent') > -1 || type.indexOf('Gateway') > -1) {
      this.contextMenuPosition = {x: event.originalEvent.clientX + 'px', y: event.originalEvent.clientY + 'px'};
      this.currentElement = event.element;
      if (this.bpm.queues?.length) {
        const queueFind = this.bpm.queues.find((q: Queue) => q.id_bpmn_element === this.currentElement.id);
        if (queueFind) {
          this.queueSelected = {...queueFind};
        } else {
          this.queueSelected = ({} as Queue);
        }
        this.existQueue = !!Object.entries(this.queueSelected).length;
      } else {
        this.existQueue = false;
        this.queueSelected = {} as Queue;
      }
      const result = await this.bpmnJS.saveXML({format: true});
      this.bpmnXML = result.xml;


      console.log(this.queueSelected);
      this.store.dispatch(controlTask({task: this.queueSelected}));
      this.store.dispatch(controlElement({element: JSON.parse(JSON.stringify(this.currentElement.businessObject))}));
      this.contextMenu.openMenu();
    }
  }

  private avoidContextMenu(): void {
    this.bpmnJS.on('element.contextmenu', (event: any) => {
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();
    });
  }

  // TODO implement full screen bpmn modeler
  public setFullScreen(): void {
  }

  public async downloadSVG() {
    const svgFile = await this.exportSVGFile();
    const svg = document.createElement('a');
    svg.href = window.URL.createObjectURL(svgFile);
    svg.download = this.bpm.name + '.svg';
    document.body.appendChild(svg);
    svg.click();
    document.body.removeChild(svg);
    this.showOptions = false;
  }

  private exportSVGFile(): Promise<File> {
    return new Promise((res, rej) => {
      this.bpmnJS.saveSVG((err: any, svg: any) => {
        if (err) {
          rej(err);
          return;
        }
        const blobSVG = new Blob([svg], {type: 'application/svg+xml'});
        const svgFile = new File([blobSVG], `${this.bpm.name}`);
        res(svgFile);
      });
    });
  }

  // TODO implement get history
  public getHistory() {
  }

  public confirmDeleteBpm(event: boolean): void {
    if (event) {
      this.deleteProcess();
    } else {
      this.showConfirm = false;
    }
  }

  public deleteProcess(): void {
    this.isBlockedPage = true;
    this._subscription.add(
      this.processService.deleteBpm(this.bpm.id || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.messageService.add({type: 'success', message: res.msg, life: 5000});
            this.router.navigateByUrl('/wizard/bpmn');
          }
          this.isBlockedPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockedPage = false;
          this.messageService.add({type: 'error', message: err.message, life: 5000});
          console.error(err)
        }
      })
    );
  }

  public initTaskForm(): void {
    switch (this.currentElement.type) {
      case 'bpmn:IntermediateCatchEvent':
      case 'bpmn:ExclusiveGateway':
      case 'bpmn:ParallelGateway':
      case 'bpmn:InclusiveGateway':
      case 'bpmn:ComplexGateway':
      case 'bpmn:EventBasedGateway':
      case 'bpmn:SendTask':
      case 'bpmn:UserTask':
      case 'bpmn:ManualTask':
      case 'bpmn:BusinessRuleTask':
      case 'bpmn:ServiceTask':
      case 'bpmn:ScriptTask':
        this.viewSide = 'taskForm';
        return;
      case 'bpmn:ReceiveTask':
        this.viewSide = 'taskForm';
        return;
      case 'bpmn:CallActivity':
        return;
      case 'bpmn:SubProcess':
        return;
      default:
        this.messageService.add({type: 'warning', message: 'Seleccione el tipo de Actividad', life: 5000});
    }
  }

  public initActivitiesForm(): void {
    this.viewSide = 'activities';
  }

  // TODO implement disable bpmn diagram
  private disableDiagram(lockLocal: boolean): void {
    // this.showSide = false;
    this.viewSide = '';
    // this.dispatchSideState(this.showSide);
    // "lockLocal" means unlock in DB and visceversa
    if (lockLocal) {
      this.isProcessLocked = lockLocal;
      this.unlockBpmnDiagram();
      this.initViewerBPMN();
      return;
    }
    this.isBlockedPage = true;
    this._subscription.add(
      this.processService.getLockInfo(this.bpm.id?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (res.data.is_locked && !this.validateSessionLockedELS()) {
              const user = res.data.locked_info.split('|')[1];
              this.messageService.add({type: 'warning', message: `El proceso está bloqueado por ${user}`, life: 5000});
              return;
            }
            this.isProcessLocked = lockLocal;
            this.lockBpmnDiagram();
            this.initModelerBPMN();
          }
          this.isBlockedPage = false;
        },
        error: (err: HttpErrorResponse) => {
          this.isBlockedPage = false;
          this.messageService.add({type: 'error', message: err.message, life: 5000});
          console.error(err)
        }
      })
    );
  }

// TODO implement lock bpmn diagram
  private lockBpmnDiagram(): void {
    // this.isProcessLocked = false;
    // this.processService.lockProcess(this.bpm.id.toLowerCase()).subscribe((_: Response) => {});
  }

  private unlockBpmnDiagram(): void {
    this.isProcessLocked = true;
    this._subscription.add(
      this.processService.unlockProcess(this.bpm.id?.toLowerCase() || '').subscribe({
        next: (res) => {
          if (res.error) {
            this.messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            console.log('unlock process');
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this.messageService.add({
            type: 'error',
            message: 'Hubo un error a la hora de desbloquear el proceso',
            life: 5000
          });
        },
      })
    );
  }

  private validateSessionLockedELS(): boolean {
    const sessionLocked = this.bpm.locked_info ? this.bpm.locked_info.split('|')[0] : null;
    const sessionID = this.localStorage.getSessionID();
    return sessionID === sessionLocked;
  }

  public hideSide(): void {
    this.showSide = false;
    this.viewSide = '';
    this.loadProcess();
  }

  public async insertBpm() {
    if (this.validateBpmn()) {
      [this.bpm.document_id_svg, this.bpm.document_id_bpmn] = await this.exportSaveDocuments();
      const newBpmVersion: Process = this.bpm;
      newBpmVersion.process_root = this.bpm.process_root;
      newBpmVersion.version = this.versions.length + 1;
      delete newBpmVersion.id;
      this.isBlockedPage = true;
      this._subscription.add(
        this.processService.createProcess(newBpmVersion).subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.getBpmVersions(this.bpm);
              const bmp: Process = {id: res.data};
              this.selectedVersion(bmp);
              this.messageService.add({type: 'success', message: 'Versión creada correctamente!', life: 5000});
            }
            this.isBlockedPage = false;
          },
          error: (err: Error) => {
            console.error(err.message);
            this.isBlockedPage = false;
            this.messageService.add({
              type: 'error',
              message: 'Hubo un error a la hora de guardar el proceso',
              life: 5000
            });
          },
        })
      );
    } else {
      this.messageService.add({
        type: 'warning',
        message: 'El proceso no puede ser guardado porque no es valido!',
        life: 5000
      });
    }
  }

  public responseCreateQueue(res: Response): void {
    if (!res.error) {
      this.bpm.queues?.push(res.data);
      this.updateBpm();
    }
  }

  public responseUpdateQueue(res: Response): void {
    if (!res.error) {
      if (this.isChanged.val) {
        const queueIndex = this.bpm.queues?.findIndex(q => q.id === res.data.id);
        if (queueIndex !== -1) {
          // @ts-ignore
          this.bpm.queues[queueIndex] = res.data;
        }
        this.updateBpm();
      }
    }
  }

  public updateNameQueue(nameQueue: string): void {
    this.updateNameBpm(nameQueue);
  }

  private async updateBpm() {
    if (this.validateBpmn()) {
      [this.bpm.document_id_svg, this.bpm.document_id_bpmn] = await this.exportSaveDocuments();
      const bpmPersistense: Process = JSON.parse(JSON.stringify(this.bpm));
      delete bpmPersistense.status;
      delete bpmPersistense.is_locked;
      delete bpmPersistense.is_published;
      delete bpmPersistense.locked_info;
      delete bpmPersistense.process_doctypes;
      delete bpmPersistense.process_roles;
      delete bpmPersistense.queues;
      delete bpmPersistense.user_deletes;
      delete bpmPersistense.project;
      bpmPersistense.document_id_svg = this.bpm.document_id_svg?.toString();
      bpmPersistense.document_id_bpmn = this.bpm.document_id_bpmn?.toString();
      const idAns = bpmPersistense.document_id_ans ? parseInt(bpmPersistense.document_id_ans, 10) + 1 : 1;
      bpmPersistense.document_id_ans = idAns.toString();
      bpmPersistense.id = bpmPersistense.id?.toLowerCase();
      bpmPersistense.project = this.bpm.project.id.toLowerCase();
      this.isBlockedPage = true;
      this._subscription.add(
        this.processService.updateProcess(bpmPersistense).subscribe({
          next: (res: Response) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.messageService.add({type: 'success', message: res.msg, life: 5000});
              this.isChanged.val = false;
            }
            this.isBlockedPage = false;
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.isBlockedPage = false;
            this.messageService.add({
              type: 'error',
              message: 'Hubo un error a la hora de actualizar el proceso',
              life: 5000
            });
          }
        })
      );
    } else {
      this.messageService.add({
        type: 'warning',
        message: 'El proceso no puede ser guardado porque no es valido!',
        life: 5000
      });
    }
  }

  public publishBpm(): void {
    if (this.validateBpmn()) {
      this.isBlockedPage = true;
      this._subscription.add(
        this.processService.publishBpm(this.bpm.id?.toLocaleLowerCase() || '', this.bpm.process_root?.toLocaleLowerCase() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this.bpm.is_published = true;
              this.messageService.add({
                type: 'success',
                message: 'Versión del BPMN publicada correctamente',
                life: 5000
              });
            }
            this.isBlockedPage = false;
          },
          error: (err: Error) => {
            this.isBlockedPage = false;
            console.error(err.message);
            this.messageService.add({
              type: 'error',
              message: 'Hubo un error a la hora de publicar la versión el proceso',
              life: 5000
            });
          },
        })
      );
    } else {
      this.messageService.add({
        type: 'warning',
        message: 'El proceso no puede ser publicado porque no es valido!',
        life: 5000
      });
    }
  }

  private validateBpmn(): boolean {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.bpmnXML, 'text/xml');
    const processXml = xmlDoc.getElementById('Process_1');
    // @ts-ignore
    const xmlText = new XMLSerializer().serializeToString(processXml);
    const qtyProcess =
      (xmlText.match(/id="Activity_/g) || []).length +
      (xmlText.match(/id="TimerEventDefinition_/g) || []).length +
      (xmlText.match(/id="Gateway_/g) || []).length;
    if (this.bpm.queues && qtyProcess !== this.bpm.queues.length) {
      this.messageService.add({type: 'warning', message: 'Debe configurar todas las colas del proceso!', life: 5000});
      return false;
    }
    const queueMap: any = {};
    if (this.bpm.queues) {
      for (const q of this.bpm.queues) {
        if (queueMap.hasOwnProperty(q.sequences || '')) {
          this.messageService.add({
            type: 'warning',
            message: `La secuencia de la cola ${q.name} debe ser diferente a la secuencia de la cola ${queueMap[q.sequences || '']}`,
            life: 5000
          });
          return false;
        } else {
          Object.assign(queueMap, {[q.sequences || '']: q.name});
        }
        if (q.executions && q.executions.length >= 1) {
          for (const e of q.executions) {
            if (!e.rules || e.rules.length < 1) {
              this.messageService.add({
                type: 'warning',
                message: `Debe configurar las actividades de la Ejecución: ${e.name}`,
                life: 5000
              });
              return false;
            }
          }
        } else {
          this.messageService.add({
            type: 'warning',
            message: `Debe configurar las actividades de la Cola de Proceso: ${q.name}`,
            life: 5000
          });
          return false;
        }
      }
    }

    return true;
  }

  public async exportSaveDocuments(): Promise<Array<any>> {
    this.isBlockedPage = true;
    let svgFile;
    let xmlFile;
    try {
      xmlFile = await this.exportXMLB64();
      svgFile = await this.exportSVGB64();
    } catch (err) {
      return [0, 0];
    }
    const documentIdSVG = await this.saveDocument(svgFile);
    const documentIdBPMN = await this.saveDocument(xmlFile);
    if (!documentIdBPMN || !documentIdSVG) {
      // this.isAnnounceDialog = true;
      // this.isDeleteDialog = false;
      this.messageService.add({type: 'error', life: 5000, message: 'Error al guardar los documentos'});
      return [0, 0];
    }
    this.isBlockedPage = false;
    this.messageService.add({type: 'success', life: 5000, message: 'Documentos guardados correctamente'});
    return [documentIdSVG, documentIdBPMN];
  }

  /**
   * Export BPMN diagram to XML
   * @return xml string
   */
  private exportSVGB64(): Promise<string> {
    return new Promise((res, rej) => {
      this.bpmnJS.saveSVG({format: true}, (err: any, svg: any) => {
        if (err) {
          rej(err);
          return;
        }
        res(btoa(svg));
      });
    });
  }

  /**
   * Export BPMN diagram to XML
   * @return xml string
   */
  private exportXMLB64(): Promise<string> {
    return new Promise((res, rej) => {
      this.bpmnJS.saveXML({format: true}, (err: any, xml: any) => {
        if (err) {
          rej(err);
          return;
        }
        this.bpmnXML = xml;
        res(btoa(xml));
      });
    });
  }

  /**
   *  Save file Document diagram (BPMN & SVG) with ECMStoreDocument in EcatchDB
   *  @input file document to save
   *  @return datapagesID
   */
  private saveDocument(file: string): Promise<any> {
    const document: Document = {
      doctype_id: '20507613-19dc-43e0-936e-ffc176ae6bb2',
      original_file: this.bpm.name,
      file_encode: file,
      new_version: 0
    };
    return new Promise((resolve, rej) => {
      this._subscription.add(
        this.documentService.createDocument(document).subscribe({
          next: (res) => {
            if (res.error) {
              this.messageService.add({type: 'error', life: 5000, message: res.msg});
              rej(true);
            } else {
              resolve(res.data.id);
            }
          },
          error: (err: Error) => {
            console.error(err.message);
            this.messageService.add({type: 'error', life: 5000, message: 'Error al guardar el documento'});
            rej(true);
          }
        })
      );
    });
  }

  public leave(): void {
    this.unlockBpmnDiagram();
    this.router.navigateByUrl('/wizard/bpmn');
  }

  public validateBpmnEvent(): void {
    if (this.validateBpmn()) {
      this.messageService.add({type: 'success', message: 'El diagrama BPMN es válido', life: 5000});
    } else {
      this.messageService.add({type: 'warning', message: 'El diagrama BPMN no es válido', life: 5000});
    }
    this.showOptions = false;
  }

  public saveBpmn(): void {
    if (this.validateBpmn()) {
      this.exportSaveDocuments();
    } else {
      this.messageService.add({type: 'warning', message: 'El diagrama BPMN no es válido', life: 5000});
    }
    this.showOptions = false;
  }

  public confirmExit(event: boolean) {
    if (event) {
      this.leave();
    } else {
      this.showConfirmExit = false;
    }
  }

  public confirmDeleteQueue(event: boolean) {
    if (event) {
      this.deleteQueue(this.queueDelete);
    } else {
      this.showConfirmDeleteQueue = false;
      this.importDiagram(this.bpmnXML)
    }
  }

}
