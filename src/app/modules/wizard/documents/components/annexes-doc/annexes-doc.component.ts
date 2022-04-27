import {Component, OnInit} from '@angular/core';
import {Customer, DocTypeGroups, Project} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewRequired, Required} from "@app/core/models/config/annexe";
import {AnnexeService} from "@app/modules/wizard/documents/services/annexe/annexe.service";
import {State, Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {Router} from "@angular/router";
import {v4 as uuidv4} from "uuid";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {DoctypegroupService} from "@app/modules/wizard/services/doctypegroup/doctypegroup.service";


interface AnnexDoc {
  name: string,
  version: number,
  isActive: boolean,
  selected: boolean
}

@Component({
  selector: 'app-annexes-doc',
  templateUrl: './annexes-doc.component.html',
  styleUrls: ['./annexes-doc.component.scss'],
  providers: [ToastService]
})

export class AnnexesDocComponent implements OnInit {

  public readonly toastStyle: ToastStyleModel = toastDataStyle;

  private client: Customer;
  private project: Project;
  public nameClient: string = '';
  public nameProject: string = '';

  public annexesDoc: AnnexDoc[] = [];
  public annexesDocForPag: AnnexDoc[] = [];
  public isEdit = false;
  public isConfig = true;
  public isTab1 = true;

  public showOnlyCheckedTab1 = false;
  public showOnlyCheckedTab2 = false;

  public formAnnexe!: FormGroup;

  public doctypeGroups!: DocTypeGroups;

  constructor(private _annexeService: AnnexeService, private _fb: FormBuilder, private store: Store<AppState>,
              private _route: Router, private _messageService: ToastService,
              private _doctypeGroupService: DoctypegroupService) {

    if (sessionStorage.getItem('doctype')) {
      this.doctypeGroups = JSON.parse(sessionStorage.getItem('doctype') || '')
    } else {
      this._route.navigate(['wizard/documents'])
    }

    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
    this.nameClient = this.client.name + '';
    this.nameProject = this.project.name + '';

    this.formAnnexe = this._fb.group({
      name: ['', [Validators.required]],
      version: ['', [Validators.required]],
      is_active: [false, []],
    })

    /*if(this.doctypeGroups?.id){
      this._doctypeGroupService.getRequiredByDoctypeID(this.doctypeGroups?.id).subscribe({
        next: (res)=>{
          console.log('correct',res)
          console.log(this.doctypeGroups  )
        },
        error: ()=>{

        }
      })

      this._doctypeGroupService.getAllDoctype().subscribe({
        next: (res)=>{
          console.log('correct all',res)
          console.log(this.doctypeGroups  )
        },
        error: ()=>{

        }
      })
    }*/

  }

  ngOnInit(): void {
    this.annexesDoc.push({
      name: 'Persona Jurídica',
      version: 1,
      isActive: true,
      selected: true
    });
    this.annexesDoc.push({
      name: 'Persona Natural',
      version: 2,
      isActive: false,
      selected: false
    });
  }

  public addedAnnexe() {
    if (this.formAnnexe.valid) {
      const required: NewRequired = {
        id: uuidv4().toLowerCase(),
        name: this.formAnnexe.get('name')?.value,
        version: this.formAnnexe.get('version')?.value,
        is_active: this.formAnnexe.get('is_active')?.value,
        doctype_id: this.doctypeGroups.id?.toString() || ''
      }
      this._annexeService.createRequired(required).subscribe({
        next: (res: any) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000})
          } else {
            this.formAnnexe.reset({name: '', version: '', is_active: false});
            this._messageService.add({type: 'success', message: 'Anexo creado con éxito', life: 5000})
          }
        },
        error: () => {
          this._messageService.add({type: 'error', message: 'Conexión perdida con el servidor', life: 5000})
        }
      })
    } else {
      this.formAnnexe.markAllAsTouched();
    }
  }

  public onlyNumbers = {}

}
