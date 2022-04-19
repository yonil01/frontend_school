import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DEFAULT_BPMN_BASE64} from "@app/core/constants/bpmn/default-bpmn-b64";
import {Project} from "@app/core/models/wizard/wizard";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {ToastService} from "ecapture-ng-ui";
import {DocTypes, Process, ProcessDoctype, ProcessRole, Role} from "@app/core/models";
import {ProcessService} from "@app/modules/wizard/services/process/process.service";
import {DocumentService} from '@app/core/services/graphql/doc/document/document.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {v4 as uuidv4} from 'uuid';
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {FilterService} from "@app/ui/services/filter.service";
import {Router} from "@angular/router";
import {controlBpm} from "@app/core/store/actions/bpm.action";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";

interface ProcessCard {
  process: Process;
  diagramSVG: any;
}

@Component({
  selector: 'app-progress-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  private readonly defaultSVG: SafeResourceUrl;
  public readonly toastStyle: ToastStyleModel = toastDataStyle;
  public project: Project;
  public roles: Role[] = [];
  public docTypes: DocTypes[] = [];
  public processes: ProcessCard[] = [];
  public processesDisplay: ProcessCard[] = [];
  public allProcesses: ProcessCard[] = [];
  public isBlockPage: boolean = false;
  public processForm: FormGroup;
  public idProcess: string = '';
  public rolesSelected: Role[] = [];
  public rolesAvailable: Role[] = [];
  public doctypesSelected: DocTypes[] = [];
  public doctypesAvailable: DocTypes[] = [];
  public view: string = 'listProcess';
  public positionStep: number = 1;
  public currentProcess: ProcessCard = {
    diagramSVG: undefined,
    process: {}
  };

  public showAlert: boolean = false;

  constructor(
    private _sanitizer: DomSanitizer,
    private _roleService: RoleService,
    private _doctypeGroupService: DoctypegroupService,
    private _messageService: ToastService,
    private _documentService: DocumentService,
    private _fb: FormBuilder,
    private _processService: ProcessService,
    private _filterService: FilterService,
    private _router: Router,
    private _store: Store<AppState>,
  ) {
    this.processForm = _fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      type: ['', Validators.required],
      icon: ['', Validators.required],
      ans: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      alert: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]]
    });
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.defaultSVG = this._sanitizer.bypassSecurityTrustResourceUrl(DEFAULT_BPMN_BASE64);
    this._subscription.add(
      this._roleService.getRoles().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this.roles = res.data;
            }
          },
          error: (err) => {
            this._messageService.add({message: 'Error Cuando se trato de traer los roles', type: 'error', life: 5000});
            console.error(err);
          }
        }
      )
    );

    this._subscription.add(
      this._doctypeGroupService.getDoctypeGroupsProject().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              if (res.data) {
                res.data.forEach((tg: any) => {
                  if (tg.doctypes) this.docTypes = this.docTypes.concat(tg.doctypes);
                });
              }
            }
          },
          error: (err) => {
            this._messageService.add({
              message: 'Error Cuando se trato de traer los grupos documentales',
              type: 'error',
              life: 5000
            });
            console.error(err);
          }
        }
      )
    );
    this.loadProcesses();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public loadProcesses(): void {
    this.isBlockPage = true;
    this._subscription.add(
      this._processService.getProcessByProjectID(this.project.id.toLowerCase()).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            if (res.data) {
              this.processes = [];
              this.processesDisplay = [];
              res.data.forEach(async (p: Process) => {
                let docSVG;
                if (p.document_id_svg) {
                  const doc = await this.getDocumentSVG(p.document_id_svg);
                  docSVG = doc ? this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${doc}`) : 'document-no-found';
                }
                const processCard: ProcessCard = {process: p, diagramSVG: docSVG ? docSVG : this.defaultSVG};
                this.processes.push(processCard);
                this.processesDisplay.push(processCard);
              });
              this.allProcesses = this.processes;
            } else {
              this._messageService.add({
                message: 'No hay procesos creados para este proyecto',
                type: 'error',
                life: 5000
              });
            }
          }
          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this._messageService.add({
            message: 'Error Cuando se trato de traer los grupos documentales',
            type: 'error',
            life: 5000
          });
          this.isBlockPage = false;
          console.error(err);
        }
      })
    );
  }

  private getDocumentSVG(documentID: string): Promise<string> {
    return new Promise<any>((resolve, _) => {
      this._documentService.getDocumentByID(documentID).subscribe((res) => resolve(res?.data.file_encode));
    });
  }

  public onSubmitFirstStep(): void {
    if (this.processForm.valid) {
      if (this.idProcess === '') {
        this.createProcess();
      } else {
        this.updateProcess(true);
      }
    } else {
      this.processForm.markAllAsTouched();
      this._messageService.add({message: 'Complete todos los campos correctamente!', type: 'warning', life: 5000});
    }
  }

  public onSubmitSecondStep(): void {
    if (this.doctypesSelected.length > 0) {
      this.positionStep++;
    } else {
      this._messageService.add({
        message: 'Debe de seleccionar al menos un tipo documental para poder seguir!',
        type: 'warning',
        life: 5000
      });
    }
  }

  private createProcess(): void {
    this.isBlockPage = true;
    const bpm: Process = {
      name: this.processForm.get('name')?.value,
      description: this.processForm.get('description')?.value,
      class: this.processForm.get('icon')?.value,
      ans: this.processForm.get('ans')?.value,
      percent_alert: this.processForm.get('alert')?.value,
      type_process: parseInt(this.processForm.get('type')?.value, 10),
    };
    bpm.version = 1;
    bpm.project = this.project.id.toLowerCase();
    bpm.id = uuidv4().toLowerCase();
    bpm.process_root = bpm.id;
    this._subscription.add(
      this._processService.createProcess(bpm).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            this._messageService.add({message: 'El proceso se ha creado correctamente!', type: 'success', life: 5000});
            this.currentProcess = {process: bpm, diagramSVG: this.defaultSVG};
            this.processes.push(this.currentProcess);
            this.positionStep++;
          }
          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            message: 'Ocurrio un error cuando se trato de crear el proceso!',
            type: 'error',
            life: 5000
          });
        }
      })
    );
  }

  public updateProcess(next: boolean): void {
    const process: any = {
      name: this.processForm.get('name')?.value,
      description: this.processForm.get('description')?.value,
      class: this.processForm.get('icon')?.value,
      ans: this.processForm.get('ans')?.value,
      percent_alert: this.processForm.get('alert')?.value,
      type_process: parseInt(this.processForm.get('type')?.value, 10),
      id: this.currentProcess.process.id?.toLowerCase(),
      process_root: this.currentProcess.process.process_root?.toLowerCase(),
      project: this.currentProcess.process.project.id.toLowerCase(),
      version: this.currentProcess.process.version,
      document_id_bpmn: this.currentProcess.process.document_id_bpmn,
      document_id_svg: this.currentProcess.process.document_id_svg,
      document_id_ans: this.currentProcess.process.document_id_ans
    };
    this.isBlockPage = true;
    this._subscription.add(
      this._processService.updateProcess(process).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            this._messageService.add({message: 'Proceso actualizado correctamente', type: 'success', life: 5000});
            if (next) {
              this.positionStep++;
            } else {
              this.cancelCreateOrUpdate();
            }
          }
          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            message: 'Hubo un problema a al ahora de actualizar el proceso',
            type: 'error',
            life: 5000
          });
        }
      })
    );
  }

  public cancelCreateOrUpdate(): void {
    this.view = 'listProcess';
    this.idProcess = '';
    this.positionStep = 1;
    this.processForm.reset();
    this.rolesSelected = [];
    this.doctypesSelected = [];
    this.rolesAvailable = [];
    this.doctypesAvailable = [];
    this.currentProcess = {process: {}, diagramSVG: this.defaultSVG};
    this.loadProcesses();
  }

  public assignItemsDoctypes(items: string[]): void {
    const processDoctypes: ProcessDoctype[] = [];

    for (const doctypes of items) {
      const processDoctype: ProcessDoctype = {
        id: uuidv4().toLowerCase(),
        process_id: this.currentProcess.process.id?.toLowerCase(),
        doctype_id: doctypes.toLowerCase(),
      };
      processDoctypes.push(processDoctype);
    }
    if (processDoctypes.length > 0) {
      this.isBlockPage = true;
      this._subscription.add(
        this._processService.createProcessDoctypes(processDoctypes).subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this._messageService.add({
                message: 'Se asigno correctamente los tipos documentales al proceso',
                type: 'success',
                life: 5000
              });
              for (const doc of processDoctypes) {
                const doctype = this.docTypes.find(d => d.id === doc.doctype_id);
                if (doctype) {
                  this.doctypesSelected.push(doctype);
                  this.currentProcess.process.process_doctypes?.push({
                    id: doc.id,
                    process_id: doc.process_id,
                    doctype_id: doc.doctype_id,
                    doctype
                  });
                  this.doctypesAvailable = this.doctypesAvailable.filter(d => d.id !== doctype.id);
                }
              }
            }
            this.isBlockPage = false;
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            console.error(err.message);
            this._messageService.add({
              message: 'Ocurrio un error cuando se trato de agregar los tipos documentales el proceso!',
              type: 'error',
              life: 5000
            });
          }
        })
      );
    }
  }

  public unAssignItemsDoctypes(items: string[]): void {
    for (const id of items) {
      this.isBlockPage = true;
      const doctype = this.currentProcess.process.process_doctypes?.find(d => d.doctype?.id === id);
      if (doctype) {
        this._subscription.add(
          this._processService.deleteProcessDoctype(doctype.id?.toLowerCase() || '').subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({message: res.msg, type: 'error', life: 5000});
              } else {
                this._messageService.add({
                  message: 'Se elimino la relacion del tipo documental',
                  type: 'success',
                  life: 5000
                });
                this.currentProcess.process.process_doctypes = this.currentProcess.process.process_doctypes?.filter((pdt) => pdt.id?.toLowerCase() !== id.toLowerCase());
                this.doctypesSelected = this.doctypesSelected.filter((doctype) => doctype.id?.toLowerCase() !== id.toLowerCase());
                const doc = this.docTypes.find((doc) => doc.id?.toLowerCase() === id.toLowerCase());
                if (doc) {
                  this.doctypesAvailable.push(doc);
                }
              }
              this.isBlockPage = false;
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              this._messageService.add({
                message: 'Ocurrio un error cuando se trato de eliminar los tipos documentales el proceso!',
                type: 'error',
                life: 5000
              });
              console.error(err.message);
            }
          })
        );
      } else {
        this.isBlockPage = false;
      }
    }
  }

  public assignItemsRoles(items: string[]): void {
    const processRole: ProcessRole[] = [];

    for (const role of items) {
      const processDoctype: ProcessRole = {
        id: uuidv4().toLowerCase(),
        process_id: this.currentProcess.process.id?.toLowerCase(),
        role_id: role.toLowerCase(),
      };
      processRole.push(processDoctype);
    }
    this.isBlockPage = true;
    this._subscription.add(
      this._processService.createProcessRoles(processRole).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            this._messageService.add({
              message: 'Se asigno correctamente los roles al proceso',
              type: 'success',
              life: 5000
            });
            for (const roleItem of processRole) {
              const roles = this.roles.find(d => d.id === roleItem.role_id);
              if (roles) {
                this.currentProcess.process.process_roles?.push({
                  id: roleItem.id,
                  process_id: roleItem.process_id,
                  role_id: roleItem.role_id,
                  role: roles
                });
                this.rolesSelected.push(roles);
                this.rolesAvailable = this.rolesAvailable.filter(d => d.id !== roles.id);
              }
            }
          }
          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            message: 'Ocurrio un error cuando se trato de agregar los roles al proceso!',
            type: 'error',
            life: 5000
          });
        }
      })
    );
  }

  public unAssignItemsRoles(items: string[]): void {
    this.isBlockPage = true;

    for (const id of items) {
      const role = this.currentProcess.process.process_roles?.find(d => d.role?.id === id);
      if (role) {
        this._subscription.add(
          this._processService.deleteProcessRole(role.id?.toLowerCase() || '').subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({message: res.msg, type: 'error', life: 5000});
              } else {
                this._messageService.add({
                  message: 'Se elimino correctamente el rol del proceso',
                  type: 'success',
                  life: 5000
                });
                this.currentProcess.process.process_roles = this.currentProcess.process.process_roles?.filter((pdt) => pdt.id?.toLowerCase() !== id.toLowerCase());
                this.rolesSelected = this.rolesSelected.filter((roles) => roles.id?.toLowerCase() !== id.toLowerCase());
                const doc = this.roles.find((doc) => doc.id?.toLowerCase() === id.toLowerCase());
                if (doc) {
                  this.rolesAvailable.push(doc);
                }
              }
              this.isBlockPage = false;
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              this._messageService.add({
                message: 'Ocurrio un error cuando se trato de eliminar el rol del proceso!',
                type: 'error',
                life: 5000
              });
              console.error(err.message);
            }
          })
        );
      }
    }
  }

  private loadProcessDoctypesAndProcessRoles(processCard: ProcessCard): void {
    this.doctypesSelected = [];
    this.doctypesAvailable = [];

    this.rolesSelected = [];
    this.rolesAvailable = [];
    for (const dt of this.docTypes) {
      if (processCard.process.process_doctypes?.find((pdt) => pdt.doctype?.id?.toLowerCase() === dt.id?.toLowerCase())) {
        this.doctypesSelected.push(dt);
      } else {
        this.doctypesAvailable.push(dt);
      }
    }

    for (const r of this.roles) {
      if (processCard.process.process_roles?.find((pdt) => pdt.role?.id?.toLowerCase() === r.id?.toLowerCase())) {
        this.rolesSelected.push(r);
      } else {
        this.rolesAvailable.push(r);
      }
    }
  }

  public onCreateProcess(): void {
    this.view = 'createProcess';
    this.doctypesAvailable = this.docTypes;
    this.rolesAvailable = this.roles;
  }

  public onUpdateProcess(processCard: ProcessCard): void {
    this.view = 'editProcess';
    this.currentProcess = processCard;
    this.idProcess = processCard.process.id || '';
    this.processForm.get('name')?.setValue(processCard.process.name || '');
    this.processForm.get('type')?.setValue(processCard.process.type_process?.toString() || '');
    this.processForm.get('icon')?.setValue(processCard.process.class || '');
    this.processForm.get('ans')?.setValue(processCard.process.ans || 0);
    this.processForm.get('alert')?.setValue(processCard.process.percent_alert || 0);
    this.processForm.get('description')?.setValue(processCard.process.description || '');
    this.loadProcessDoctypesAndProcessRoles(processCard);
  }

  public findProcess(event: any, dataToFilter: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name' || 'id' || 'label' || 'description').split(',');
      this.processesDisplay = this._filterService.filter(dataToFilter, searchFields, filterValue, 'contains');
    } else {
      this.processesDisplay = dataToFilter;
    }
  }

  private deleteProcess(process: ProcessCard) {
    if (this.validateDeleteProcess(process)) {
      this.isBlockPage = true;
      this.showAlert = false;
      this._subscription.add(
        this._processService.deleteBpm(process.process.id || '').subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this._messageService.add({
                message: 'Se elimino correctamente el proceso',
                type: 'success',
                life: 5000
              });
              this.processes = this.processes.filter((p) => p.process.id !== process.process.id);
              this.processesDisplay = this.processesDisplay.filter((p) => p.process.id !== process.process.id);
              this.currentProcess = {process: {}, diagramSVG: ''};
            }
            this.isBlockPage = false;
          },
          error: (err: Error) => {
            this.isBlockPage = false;
            this._messageService.add({
              message: 'Ocurrio un error cuando se trato de eliminar el proceso!',
              type: 'error',
              life: 5000
            });
            console.error(err.message);
          }
        })
      );
    } else {
      this.showAlert = false;
      this._messageService.add({
        message: 'No se puede eliminar el proceso, ya que tiene elementos asociados',
        type: 'error',
        life: 5000
      });
    }
  }

  private validateDeleteProcess(process: ProcessCard): boolean {
    if (process?.process?.process_roles?.length && process?.process?.process_roles?.length > 0) {
      return false;
    }
    if (process?.process?.process_doctypes?.length && process?.process?.process_doctypes?.length > 0) {
      return false;
    }

    return !(process.process.queues?.length && process.process.queues?.length > 0);
  }

  public confirmDialog(event: boolean): void {
    if (event) {
      this.deleteProcess(this.currentProcess);
    } else {
      this.showAlert = false;
      this.currentProcess = {process: {}, diagramSVG: ''};
    }
  }

  public showProcess(process: Process): void {
    this._store.dispatch(controlBpm({ bpm: process }));
    this.isBlockPage = true;
    this._router.navigateByUrl('wizard/bpmn/show').then(() => {
      this.isBlockPage = false;
    }).catch((err) => {
      this.isBlockPage = false;
      console.error(err);
    });
  }

}
