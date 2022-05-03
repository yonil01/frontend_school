import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {DEFAULT_BPMN_BASE64} from "@app/core/constants/bpmn/default-bpmn-b64";
import {Project} from "@app/core/models/wizard/wizard";
import {RoleService} from "@app/modules/wizard/services/roles/role.service";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";
import {ToastService} from "ecapture-ng-ui";
import {Customer, DocTypes, Process, ProcessDoctype, ProcessRole, Role} from "@app/core/models";
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
import {Ans, Reminder} from "@app/core/models/config/ans";
import {NotificationService} from "@app/modules/administration/services/notification/notification.service";
import {NotificationModel} from "@app/core/models/config/notification";
import {HttpErrorResponse} from "@angular/common/http";
import {IconsMaterial} from "@app/core/constants/icons/material-icons";
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";

interface ProcessCard {
  process: Process;
  diagramSVG: any;
}

interface ListAns {
  status: boolean,
  value: Ans
}

interface ListReminders {
  status: boolean,
  value: Reminder
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
  public icons: any[] = IconsMaterial;
  public readonly dropStyle: DropdownModel = dropStyle;
  public project: Project;
  public client: Customer;
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
  public AnsForm: FormGroup;
  public ReminderForm: FormGroup;
  public currentProcess: ProcessCard = {
    diagramSVG: undefined,
    process: {}
  };
  public statusEditAns: boolean = false;
  public showAlert: boolean = false;
  public idAnsSelect: string = '';
  public nameAnsSelect: string = '';
  public idReminderSelect: string = '';
  public statusEditReminder: boolean = false;
  public activeOneAns: boolean = false;

  public showReminder: boolean;
  public dataListAns: ListAns[] = [];
  public notifications: NotificationModel[] = [];

  public dataListReminders: ListReminders[] = [];

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
    private _notificationService: NotificationService
  ) {
    this.processForm = _fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      type: ['', Validators.required],
      icon: ['', Validators.required],
      ans: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      alert: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8000)]]
    });
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
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
      this._doctypeGroupService.getDoctypeGroupsByProjectID(this.project.id).subscribe(
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
          error: (err: HttpErrorResponse) => {
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
    this.AnsForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      type: ['', Validators.required],
    });
    this.ReminderForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      reminder_type: ['', Validators.required],
      percent_reminder: ['', Validators.required],
      notification_id: ['', Validators.required],
    },{
      validators: [this.minValueValidator, this.maxValueValidator]
      })
    this.showReminder = false;
  }

  ngOnInit(): void {
  }

  minValueValidator = (form: FormGroup) => {
    const percent_reminder = form.get('percent_reminder');
    return Number(percent_reminder?.value) >= 0 ? null : {notEqualMinValue: true};
  };

  maxValueValidator = (form: FormGroup) => {
    const percent_reminder = form.get('percent_reminder');
    return Number(percent_reminder?.value) <= 100 ? null : {notEqualMaxValue: true};
  };

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

  public onSubmitSecondStepAns():void {
    if (this.doctypesSelected.length > 0) {
      this.loadAns();
      this.getNotifications();
      this.positionStep++;
    } else {
      this._messageService.add({
        message: 'Debe de seleccionar al menos un tipo documental para poder seguir!',
        type: 'warning',
        life: 5000
      });
    }
  }

  public loadAns(): void {
    this.isBlockPage = true;
    this.dataListAns = [];
    this._subscription.add(
      this._processService.getProcessByID(this.idProcess).subscribe({
        next: (res) => {
          if (res.error) {
            this.isBlockPage = false;
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            if (res.data) {
              if (res.data.sla.length) {
                  res.data.sla.forEach((item: Ans)=>{
                    this.dataListAns.push({status: false, value: item})
                  })
              }
              this.isBlockPage = false;
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

  public saveAns():void {
    if (this.AnsForm.valid) {
      this.isBlockPage = true;
      const newAns: Ans = {
        id: this.statusEditAns ? this.idAnsSelect : uuidv4().toLowerCase(),
        name: this.AnsForm.get('name')?.value,
        ans_type_id: Number(this.AnsForm.get('type')?.value),
        workflow_id: String(this.currentProcess.process.id)
      }
      if (this.statusEditAns) {
        this._subscription.add(
          this._processService.updateAns(newAns).subscribe({
            next: (res) => {
              if (res.error) {
                this.isBlockPage = false;
                this._messageService.add({message: res.msg, type: 'error', life: 5000});
              } else {
                this.isBlockPage = false;
                this._messageService.add({message: res.msg, type: 'success', life: 5000});
                this.loadAns();
                this.AnsForm.reset();
                this.statusEditAns = false;
              }
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                message: 'Ocurrio un error cuando se trato de agregar los ans!',
                type: 'error',
                life: 5000
              });
            }
          })
        );
      } else {
        this._subscription.add(
          this._processService.createAns(newAns).subscribe({
            next: (res) => {
              if (res.error) {
                this.isBlockPage = false;
                this._messageService.add({message: res.msg, type: 'error', life: 5000});
              } else {
                this.isBlockPage = false;
                this._messageService.add({message: res.msg, type: 'success', life: 5000});
                this.loadAns();
                this.AnsForm.reset();
              }
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                message: 'Ocurrio un error cuando se trato de agregar los ans!',
                type: 'error',
                life: 5000
              });
            }
          })
        );
      }
    }
  }


  public changeStatus(index: number):void {
    this.dataListAns[index].status = !this.dataListAns[index].status;
    this.activeOneAns = this.searchReminderActive();
  }

  public changeStatusReminder(index: number): void {
    this.dataListReminders[index].status = !this.dataListReminders[index].status;
  }

  public changeStep(index: number):void {
    if (this.searchReminderActive() && index) {
      this.dataListReminders = [];
      const dataAnsActive = Object.assign( {}, ...this.dataListAns.filter((data:ListAns)=>data.status));
      this.idAnsSelect = dataAnsActive.value.id;
      this.nameAnsSelect = dataAnsActive.value.name;
      if (dataAnsActive.value.reminders) {
        dataAnsActive.value.reminders?.forEach((data:Reminder)=> {
          const notify = Object.assign({},...this.notifications.filter((item:NotificationModel)=>item.id===data.notification_id));
          const reminderTemp: Reminder = {
            id: data.id,
            name: data.name,
            reminder_type: data.reminder_type,
            percent_reminder: data.percent_reminder,
            notification_id: notify.name,
            ans_id: data.ans_id,
            id_user: data.id_user,
            queue_id: data.queue_id,
          }
          this.dataListReminders.push({status: false, value: reminderTemp});
        });
      }
      this.showReminder = true;
    } else {
      this.loadAns();
      this.showReminder = false;
    }
  }

  public searchReminderActive():boolean {
    if (this.dataListAns.length) {
      const countActive = this.dataListAns.filter((data:ListAns)=>data.status);
      return countActive.length === 1;
    }
    return false;
  }


  public addReminder():void {
    console.log(this.ReminderForm)
    debugger
    if (this.ReminderForm.valid) {
      this.isBlockPage = true;
      const dataAns = this.dataListAns.filter((data:ListAns)=>{
        return data.status
      })
      const NewReminder: Reminder = {
        id: this.statusEditReminder ? this.idReminderSelect :uuidv4().toLowerCase(),
        name: this.ReminderForm.get('name')?.value,
        percent_reminder: Number(this.ReminderForm.get('percent_reminder')?.value),
        ans_id: dataAns[0].value.id,
        reminder_type: Number(this.ReminderForm.get('reminder_type')?.value),
        notification_id: this.ReminderForm.get('notification_id')?.value,
        queue_id: "4e09c5d5-1db1-4de2-8bc7-1b69d85ba775",
        id_user: "4e09c5d5-1db1-4de2-8bc7-1b69d85ba775"
      }
      if (this.statusEditReminder) {
        this._subscription.add(
          this._processService.updateAndReminder(NewReminder).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({message: res.msg, type: 'error', life: 5000});
                this.isBlockPage = false;
              } else {
                this.isBlockPage = false;
                this.getAnsByiD(this.idAnsSelect);
                this._messageService.add({message: res.msg, type: 'success', life: 5000});
                this.ReminderForm.reset();

              }
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                message: 'Ocurrio un error cuando se trato de crear el recordatorio!',
                type: 'error',
                life: 5000
              });
              this.isBlockPage = false;
            }
          })
        );
      } else {
        this._subscription.add(
          this._processService.createAndReminder(NewReminder).subscribe({
            next: (res) => {
              if (res.error) {
                this._messageService.add({message: res.msg, type: 'error', life: 5000});
                this.isBlockPage = false;
              } else {
                this.isBlockPage = false;
                this.getAnsByiD(this.idAnsSelect);
                this._messageService.add({message: res.msg, type: 'success', life: 5000});
                this.ReminderForm.reset();

              }
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                message: 'Ocurrio un error cuando se trato de crear el recordatorio!',
                type: 'error',
                life: 5000
              });
              this.isBlockPage = false;
            }
          })
        );
      }
    }
  }

  public deleteAns():void {
    this.isBlockPage = true;
    this.dataListAns.forEach((data: ListAns)=>{
      if (data.status) {
        this._processService.deleteAns(data.value.id?.toLowerCase() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this._messageService.add({
                message: 'Se elimino ANS seleccionado',
                type: 'success',
                life: 5000
              });
            }
            this.isBlockPage = false;
            this.loadAns();
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
      }
    })
  }

  public getNotifications(): void {
    this._subscription.add(
      this._notificationService.getNotifications().subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({
              type: 'error',
              message: res.msg,
              life: 5000,
            })
            this.isBlockPage = false;
          } else {
            if (res.data.length) {
              this.notifications = res.data
            }
            this.isBlockPage = false;
          }
        },
        error: (err: Error) => {
          this._messageService.add({
            type: 'error',
            message: 'Error contactese con el administrador!',
            life: 5000,
          })
        }
      })
    );
  }

  public editAns(data: Ans): void {
    this.AnsForm.get('name')?.setValue(data.name);
    this.AnsForm.get('type')?.setValue(data.ans_type_id);
    this.idAnsSelect = data.id;
    this.statusEditAns = true;
  }

  public deleteReminder(): void {
    this.isBlockPage = true;
    this.dataListReminders.forEach((data: ListReminders)=>{
      if (data.status) {
        this._processService.deleteReminder(data.value.id?.toLowerCase() || '').subscribe({
          next: (res) => {
            if (res.error) {
              this.isBlockPage = true;
              this._messageService.add({message: res.msg, type: 'error', life: 5000});
            } else {
              this.getAnsByiD(this.idAnsSelect);
              this._messageService.add({
                message: 'Se elimino la relacion del tipo documental',
                type: 'success',
                life: 5000
              });
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
      }
    })
  }

  public editReminder(data: Reminder): void {
    this.idReminderSelect = data.id;
    this.ReminderForm.get('name')?.setValue(data.name);
    this.ReminderForm.get('reminder_type')?.setValue(data.reminder_type);
    this.ReminderForm.get('percent_reminder')?.setValue(data.percent_reminder);
    this.ReminderForm.get('notification_id')?.setValue(data.notification_id);
    this.statusEditReminder = true;
  }

  public getAnsByiD(Id: string): void {
    this.isBlockPage = true;
    this._subscription.add(
      this._processService.getAndsByID(Id).subscribe({
        next: (res) => {
          if (res.error) {
            this.isBlockPage = false;
            this._messageService.add({message: res.msg, type: 'error', life: 5000});
          } else {
            if (res.data) {
              if (res.data.reminders.length) {
                this.dataListReminders = [];
                res.data.reminders.forEach((data:Reminder)=> {
                  const notify = Object.assign({},...this.notifications.filter((item:NotificationModel)=>item.id===data.notification_id));
                  const reminderTemp: Reminder = {
                    id: data.id,
                    name: data.name,
                    reminder_type: data.reminder_type,
                    percent_reminder: data.percent_reminder,
                    notification_id: notify.name,
                    ans_id: data.ans_id,
                    id_user: data.id_user,
                    queue_id: data.queue_id,
                  }
                  this.dataListReminders.push({status: false, value: reminderTemp});
                })
                this.isBlockPage = false;
              }

            } else {
              this.isBlockPage = false;
              this._messageService.add({
                message: 'No hay recordatorios para este ans',
                type: 'error',
                life: 5000
              });
            }
          }
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

}
