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

@Component({
  selector: 'app-process-show',
  templateUrl: './process-show.component.html',
  styleUrls: ['./process-show.component.scss']
})
export class ProcessShowComponent implements OnInit, AfterContentInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public isBlockedPage: boolean = false;

  public bpm: Process = {};
  public versions: any[] = [];
  public isShowVersions = false;
  public versionBpm: any;
  public isChangedVersion = false;
  public queueSelected: Queue = {};
  public execution: Execution = {};
  public isProcessLocked: boolean = false;
  public isReloading: boolean = false;
  public currentElement: any;
  public isDeleteDialog: boolean = false;
  public isAnnounceDialog: boolean = false;
  public isPublishDialog: boolean = false;
  public existQueue: boolean = false;
  public showSide: boolean = false;
  public itemsOptions: any[] = [];
  public itemsPublishDB: any[] = [];
  public isChanged = {val: false};
  public contextMenuPosition: any;
  public colors: string[];
  public viewSide: string = '';
  // Private
  private bpmnJS: BpmnJSModeler = new BpmnJSModeler();
  private bpmnXML: string = '';
  private elementAdded: boolean = false;
  @ViewChild(MatMenuTrigger, {static: true}) contextMenu!: MatMenuTrigger;
  @ViewChild('bpmn', {static: true}) private elementBpmn!: ElementRef;
  @ViewChild('configContainer', {read: ViewContainerRef}) configContainer!: ViewContainerRef;
  public showMenu: boolean = false;

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
    this.colors = [
      '#FFFFFF',
      '#C8E6C9',
      '#FFCDD2',
      '#CC0000',
      '#FF4444',
      '#FF7F7F',
      '#CC6C00',
      '#FF8800',
      '#FFBB33',
      '#436500',
      '#669900',
      '#99CC00',
      '#6B238E',
      '#9933CC',
      '#AA66CC',
      '#007299',
      '#0099CC',
      '#33B5E5',
      '#B20058',
      '#E50072',
      '#FF3298',
    ];
    this.contextMenuPosition = {x: '0px', y: '0px'};
    this.itemsOptions = [
      {label: 'Maximizar', icon: 'pi pi-window-maximize', command: () => this.setFullScreen()},
      {label: 'Descargar', icon: 'pi pi-download', command: () => this.downloadSVG()},
      {label: 'Historial', icon: 'pi pi-list', command: () => this.getHistory()},
      {separator: true},
      {label: 'Eliminar', icon: 'pi pi-trash', command: () => this.confirmDeleteBpm()},
      {separator: true},
      {separator: true},
      {
        label: 'Validar',
        icon: 'pi pi-check',
        command: () => {
          if (this.validateBpmn()) {
            this.notifyUser('success', '', 'Validación Correcta', 4000);
          }
        },
      },
      {label: 'Crear Versión', icon: 'pi pi-plus', command: () => this.insertBpm()},
      // { label: 'Actualizar', icon: 'pi pi-refresh', command: () => this.updateChangeBpmn() },
      {separator: true},
      {label: 'Publicar', icon: 'pi pi-cloud-upload', command: () => this.publishBpm()},
      {separator: true},
      {label: 'Salir', icon: 'pi pi-sign-out', command: () => this.leave()},
    ];
    this.itemsPublishDB = [
      {
        label: 'Validar',
        icon: 'pi pi-check',
        command: () => {
          if (this.validateBpmn()) {
            this.notifyUser('success', '', 'Validación Correcta', 4000);
          }
        },
      },
      {label: 'Crear', icon: 'pi pi-plus', command: () => this.insertBpm()},
      {label: 'Actualizar', icon: 'pi pi-refresh', command: () => this.updateChangeBpmn()},
      {separator: true},
      {label: 'Publicar', icon: 'pi pi-cloud-upload', command: () => this.publishBpm()},
    ];
    this.store.select('bpm').subscribe((res) => {
      this.bpm = res.bpm;
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

  selectedversion(bpm: Process): void {
    this.currentElement = null;
    if (bpm) {
      this.isChangedVersion = true;
      if (!this.bpm.is_locked) this.unlockBpmnDiagram();
      this.processService.getProcessByID(bpm.id?.toLowerCase() || '').subscribe((res) => {
        this.bpm = JSON.parse(JSON.stringify(res.data));
        this.getDiagram();
        this.initLockUnlockBpm();
        this.versionBpm = this.versions.find((bpmv) => this.bpm.id === bpmv.id);
      });
      this.bpmnJS.on('import.done', ({error}: any) => {
        if (!error) this.bpmnJS.get('canvas').zoom('fit-viewport');
      });
    }
  }

  loadProcess(): void {
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

  /**
   * Load diagram XML document from ecatchDB
   */
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

  /**
   * Load Default diagram from assets when no BPMN diagram exist
   * @Input proc Process for data processELS object initialization
   */
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
      this.notifyUser(
        'error',
        'Diagrama Bloqueado',
        `El Modelo está bloqueado por el usuario ${userLocked} en otra sesión`,
        6000,
      );
    } else {
      this.isProcessLocked = false;
      this.initModelerBPMN();
    }
  }

  /**
   * Import xml string to BPMN Diagrama
   * @Input xml in string
   */
  private async importDiagram(xml: any) {
    await this.bpmnJS.importXML(xml);
    /*this.bpmnJS.importXML(xml, () => {
      console.log('Diagrama cargado');
      this.isReloading = false;
      this.isChanged.val = false;
    });*/
  }

  /**
   * Get Action types from DB for BPMN history tracking
   */
  private getActionTypes(): void {
    // TODO this._bpmnService.getByID('types').subscribe((res: any) => this.ActionsTypes = res.process);
  }

  /**
   * Init BPMN Modeler and import this.bpmnXML to the modeler
   */
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

  /**
   * Init BPMN Viewer and import this.bpmnXML to the viewer
   */
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
    console.log('entro a los eventos');
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
    this.isChanged.val = true;
    if (!this.bpmnXML.includes(event.element.id) && event.element.id.substr(-5) !== 'label') {
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
      event.element.type.indexOf('Gateway') > -1
        ? event.element
        : null;
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
        /*this.confirmationService.confirm({
          header: 'Confirmación',
          message: `¿Está seguro de eliminar la Cola de Proceso?`,
          accept: () => this.deleteQueue(event),
          reject: () => this.importDiagram(this.bpmnXML),
        });*/
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
      // Valida si hay referencias a ese queue en las actividades
      // @ts-ignore
      const queueE = this.bpm.queues[index];
      if (queueE) {
        if (queueE.executions?.length) {
          this.initModelerBPMN();
          this.notifyUser('info', '', `No se puede eliminar, hay ejecuciones relacionadas.`, 6000);
          return;
        }
        if (queueE.queue_attributes?.length) {
          this.initModelerBPMN();
          this.notifyUser('info', '', `No se puede eliminar, hay atributos relacionados.`, 6000);
          return;
        }
        if (queueE.queue_roles?.length) {
          this.initModelerBPMN();
          this.notifyUser('info', '', `No se puede eliminar, hay roles relacionados.`, 6000);
          return;
        }
        const {queue, activity} = this.validateHasQueueReferences(queueE);
        if (activity) {
          // Init modeler Again with the Queue deleted
          this.initModelerBPMN();
          this.notifyUser(
            'info',
            '',
            `No se puede eliminar la cola de proceso porque es referenciada en:\nCola de proceso: ${queue}\n
        Actividad: ${activity}\nPara continuar debe actualizar la referencia.`,
            6000,
          );
          return;
        }
        // TODO
        // const executions = queueE && queueE.executions ? JSON.stringify(queueE.executions) : null;
        // const history = new HistoryBPMN(null, null, event.element.id, JSON.stringify(queueE), null, executions, null, event.element.id);
        // const succcessHistoryReg = this.addHistoryRegister(history, 'equ');
        // if (!succcessHistoryReg) return;
        this.processService.deleteQueue(queueE.id?.toLowerCase() || '').subscribe((res) => {
          if (res.error) {
            this.initModelerBPMN();
            this.notifyUser('error', '', res.msg, 6000);
          } else {
            this.notifyUser('success', '', res.msg, 6000);
            this.bpm.queues?.splice(index, 1);
            this.updateBpm();
            this.store.dispatch(controlBpm({bpm: this.bpm}));
          }
        });
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
    // TODO
    // return resp ? resp : { queue: null, execution: null, activity: null };
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
          this.queueSelected = queueFind;
        }
        this.queueSelected = this.queueSelected ? this.queueSelected : ({} as Queue);
        this.existQueue = !!Object.entries(this.queueSelected).length;
      } else {
        this.existQueue = false;
        this.queueSelected = {} as Queue;
      }
      const result = await this.bpmnJS.saveXML({format: true});
      this.bpmnXML = result.xml;

      this.store.dispatch(controlTask({task: this.queueSelected}));
      this.store.dispatch(controlElement({element: JSON.parse(JSON.stringify(this.currentElement.businessObject))}));
      this.contextMenu.openMenu();
    }
  }

  private avoidContextMenu() {
    this.bpmnJS.on('element.contextmenu', (event: any) => {
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();
    });
  }

  updateColor(color: string): void {
    const modeling = this.bpmnJS.get('modeling');
    const elements = [];
    elements.push(this.currentElement);
    modeling.setColor(elements, {
      // stroke: 'green',
      fill: color,
    });
  }

  private setFullScreen() {
  }

  private async downloadSVG() {
    const svgFile = await this.exportSVGFile();
    const svg = document.createElement('a');
    svg.href = window.URL.createObjectURL(svgFile);
    svg.download = this.bpm.name + '.svg';
    document.body.appendChild(svg);
    svg.click();
    document.body.removeChild(svg);
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

  private getHistory() {
  }

  private confirmDeleteBpm() {
    this.isDeleteDialog = true;
    this.isAnnounceDialog = false;
    /*this.confirmationService.confirm({
      header: 'Anuncio',
      message: `Está seguro de eliminar el proceso ${this.bpm.name}`,
      accept: () => this.deleteProcess(),
      reject: () => null,
    });*/
  }

  private deleteProcess() {
    this.processService.deleteBpm(this.bpm.id || '').subscribe((res) => {
      this.notifyUser(res.type, '', res.msg, 6000);
    });
  }

  /** Context menu options functions */
  initTaskForm() {
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
        this.notifyUser('warn', '', 'Seleccione el tipo de Actividad', 5000);
    }
  }

  async initActivitiesForm() {
    this.viewSide = 'activities';
  }

  // Function for Lock/Unlock Process and Diagram
  disableDiagram(lockLocal: boolean): void {
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
    this.processService.getLockInfo(this.bpm.id?.toLowerCase() || '').subscribe((res) => {
      if (res.data.is_locked && !this.validateSessionLockedELS()) {
        const user = res.data.locked_info.split('|')[1];
        this.notifyUser('info', `El proceso está bloqueado por el usuario ${user}`, 'Aceptar', 5000);
        return;
      }
      this.isProcessLocked = lockLocal;
      this.lockBpmnDiagram();
      this.initModelerBPMN();
    });
  }

  /**
   * Lock the process in ELS, is disable for the other users
   * hint: now is enable (in the modeler) for the current User.
   */
  private lockBpmnDiagram(): void {
    // this.isProcessLocked = false;
    // this.processService.lockProcess(this.bpm.id.toLowerCase()).subscribe((_: Response) => {});
  }

  /**
   * Unlock the process in ELS, is enable for the other users
   * hint: now is disable for the current user just as viewer
   */
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

  /**
   * Validate if current session_id has the diagram Locked in ELS
   * @return true if current session has blocked it, false otherwise
   */
  private validateSessionLockedELS(): boolean {
    const sessionLocked = this.bpm.locked_info ? this.bpm.locked_info.split('|')[0] : null;
    const sessionID = this.localStorage.getSessionID();
    return sessionID === sessionLocked;
  }

  hideSide() {
    this.showSide = false;
    this.viewSide = '';
    this.loadProcess();
  }

  private dispatchSideState(side: boolean) {
    this.store.dispatch(controlSide({showSide: side}));
  }

  private async insertBpm() {
    if (this.validateBpmn()) {
      [this.bpm.document_id_svg, this.bpm.document_id_bpmn] = await this.exportSaveDocuments();
      const newBpmVersion: Process = JSON.parse(JSON.stringify(this.bpm));
      newBpmVersion.process_root = this.bpm.process_root;
      newBpmVersion.version = this.versions.length + 1;
      delete newBpmVersion.id;
      this.processService.createProcess(newBpmVersion).subscribe((res) => {
        if (!res.error) {
          this.getBpmVersions(this.bpm);
          const bmp: Process = {
            id: res.data,
          };
          this.selectedversion(bmp);
          this.notifyUser('success', '', res.msg, 6000);
        } else {
          this.notifyUser('error', '', res.msg, 6000);
        }
      });
    }
  }

  responseCreateQueue(res: Response): void {
    if (res.error) {
      this.notifyUser('error', '', res.msg, 6000);
    } else {
      this.notifyUser('success', '', res.msg, 6000);
      this.updateBpm();
    }
  }

  responseUpdateQueue(res: Response): void {
    if (res.error) {
      this.notifyUser('error', '', res.msg, 6000);
    } else {
      this.notifyUser('success', '', res.msg, 6000);
      if (this.isChanged.val) this.updateBpm();
    }
  }

  updateNameQueue(nameQueue: string): void {
    this.updateNameBpm(nameQueue);
  }

  private async updateChangeBpmn() {
    // const xmlFile = await this.exportXMLB64();
  }

  private async updateBpm() {
    // if (this.validateBpmn()) {
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
    this.processService.updateProcess(bpmPersistense).subscribe((res: Response) => {
      if (res.error) {
        this.notifyUser('error', '', res.msg, 6000);
      } else {
        this.notifyUser('success', '', res.msg, 6000);
        this.isChanged.val = false;
      }
    });
    // }
  }

  private async publishBpm() {
    if (this.validateBpmn()) {
      this.processService
        .publishBpm(this.bpm.id?.toLocaleLowerCase() || '', this.bpm.process_root?.toLocaleLowerCase() || '')
        .subscribe((res: Response) => {
          if (!res.error) {
            this.bpm.is_published = true;
          }
          this.notifyUser(res.type, '', res.msg, 6000);
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
      this.notifyUser('info', '', 'Debe configurar todas las colas del proceso', 6000);
      return false;
    }
    const queueMap: any = {};
    if (this.bpm.queues) {
      for (const q of this.bpm.queues) {
        if (queueMap.hasOwnProperty(q.sequences || '')) {
          this.notifyUser(
            'warn',
            '',
            `La secuencia de la cola ${q.name} debe ser diferente a la secuencia de la cola ${queueMap[q.sequences || '']}`,
            6000,
          );
          return false;
        } else {
          Object.assign(queueMap, {[q.sequences || '']: q.name});
        }
        if (q.executions && q.executions.length >= 1) {
          for (const e of q.executions) {
            if (!e.rules || e.rules.length < 1) {
              this.notifyUser('warn', '', `Debe configurar las actividades de la Ejecución: ${e.name}`, 6000);
              return false;
            }
          }
        } else {
          this.notifyUser('warn', '', `Debe configurar las ejecuciones de la Cola de Proceso: ${q.name}`, 6000);
          return false;
        }
      }
    }

    return true;
  }

  private async exportSaveDocuments(): Promise<Array<any>> {
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
      this.isAnnounceDialog = true;
      this.isDeleteDialog = false;
      /*this.confirmationService.confirm({
        header: 'Anuncio',
        message: 'Se presentó un error!',
        accept: () => {
        },
      });*/
      return [0, 0];
    }
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
      this.documentService.createDocument(document).subscribe((res) => {
        if (res.error) rej(true);
        resolve(res.data.id);
      });
    });
  }

  public leave(): void {
    this.unlockBpmnDiagram();
    this.router.navigateByUrl('/wizard/bpmn');
  }

  private notifyUser(severity: string, summary: string, detail: string, life: number): void {
    this.messageService.add({
      type: severity,
      message: detail,
      life: life,
    });
  }

}
