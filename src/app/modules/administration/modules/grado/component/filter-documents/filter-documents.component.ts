import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {DocType, Entity} from '@app/core/models/getDoctypeGroups.model';
import {DocTypeGroupsService} from '@app/core/services/graphql/doc-type-groups/doc-type-groups.service';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/store/app.reducers';
import {controlEntities, controlDocuments, controlDoctype} from '@app/core/store/actions/doctype-group.action';
import {ReportService} from '@app/core/services/graphql/report/report.service';
import {DoctypeService} from '@app/core/services/Doctypes/doctype.service';
import {DropdownModel, ToastService} from "ecapture-ng-ui";
import {Report} from "@app/core/models/report/report";
import {dropDownStyle} from "@app/core/utils/static/data";
import {replaceAll} from "@app/core/utils/helpers/helpers";
import {Subscription} from "rxjs/internal/Subscription";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "@app/modules/administration/services/user/users.service";
import {
  columnGrado,
  dataAreaGraphics, dataCardGraphics, dataPieGraphics,
  dataGrado
} from "@app/modules/administration/modules/grado/models/constans";
import {ActivatedRoute} from "@angular/router";
import {styleTableUser} from "@app/modules/administration/modules/users/models/model-user/constans-user";

@Component({
  selector: 'app-filter-documents',
  templateUrl: './filter-documents.component.html',
  styleUrls: ['./filter-documents.component.scss'],
  providers: [],
})
export class FilterDocumentsComponent implements OnInit, OnDestroy {
  @Output() showTable = new EventEmitter<boolean>();
  public dataGraphics: any[] = []
  docTypeGroupSelected: { docTypes: DocType[]; name: string }[] = [];
  docTypesOptionsSelected: any;
public doctype: any = {}
  doctypeGroupOptions: { docTypes: DocType[]; name: string }[] = [];
  public docTypesOptions: Report[] = [];

  keyWordFilter: any = [];
  public docTypesDropdown: DropdownModel = dropDownStyle;
  public Grados: any[] = [];

  private currentProcedure: string = '';
  private _subscription: Subscription = new Subscription();
  public blockPage: boolean = false;
  public formGrado: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private docTypeGroupsService: DocTypeGroupsService,
    private doctypeService: DoctypeService,
    private GradoService: ReportService,
    private store: Store<AppState>,
    private _messageService: ToastService,
    private _userService: UsersService,
    private rutaActiva: ActivatedRoute
  ) {
    this.formGrado = this._formBuilder.group({
        value: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
      },
      {
        // validator: [this.confirmPasswordValidator],
      });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnInit(): void {
    const urlTree = this.rutaActiva.snapshot.params.id;
    const jsonDoctypes = localStorage.getItem('doctypes');
    if (jsonDoctypes) {
      const obj = JSON.parse(jsonDoctypes);
      this.doctype = obj.find((value: any) => value.id === Number(urlTree))
    }

    this.getDateSp();


  }

  private loadDocumentTypeData(): void {
    const docGroupsSelected = [...this.docTypeGroupSelected];
    if (!docGroupsSelected || docGroupsSelected.length === 0) {
      this.docTypesOptions = this.doctypeGroupOptions.reduce((previousValue: any, currentValue) => [...previousValue, ...currentValue.docTypes], []);
    } else {
      this.docTypesOptions = docGroupsSelected.reduce((previousValue: any, currentValue) => [...previousValue, ...currentValue.docTypes], []);
    }
  }

  public loadDocTypes(id: string): void {
    /*const docTypeSelectedElement: any = this.docTypesOptions.find((item) => item.id === id);
    if (docTypeSelectedElement) {
      let doctypeSelected = [docTypeSelectedElement];
      const entityList: Entity[] = [];
      doctypeSelected.reduce((previousValue, currentValue: any) => [...previousValue, ...currentValue.doctypes_entities], [])
        .forEach((item: Entity) => entityList.push(item));

      // this.store.dispatch(controlEntities({entities: entityList}));
      doctypeSelected = doctypeSelected.reduce((previousValue, currentValue: any) => [...previousValue, ...currentValue.doctypes_entities], []);

      this.currentProcedure = docTypeSelectedElement.procedure;

      this.keyWordFilter = doctypeSelected;
      this.store.dispatch(controlDoctype({selectedDoctype: docTypeSelectedElement}));
    }
*/
  }

  public searchDocuments(entities: any): void {
    const parameters: any = {};
    const attributes = entities.map((item: any) => item.attributes);
    attributes[0]?.forEach((item: any) => (parameters[item.name] = item.value));
    this.blockPage = true;
    this._subscription.add(
      this.GradoService.getInfoReport(this.currentProcedure, parameters).subscribe(
        (res: any) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (res.data.length) {
              this.store.dispatch(controlDocuments({documents: res.data}));
            } else {
              this.store.dispatch(controlDocuments({documents: []}));
              this._messageService.add({
                type: 'info',
                message: 'No se encontraron resultados para la consulta realizada!',
                life: 5000
              });
            }
          }
          this.blockPage = false;
        },
        (err: Error) => {
          this.blockPage = false;
          console.error(err.message);
          this._messageService.add({
            type: 'error',
            message: 'No se pudo obtener la información del Gradoe, verifique su conexión a internet!',
            life: 5000
          });
        })
    );
  }

  public getDateSp() {
    const newConsult = {
      "procedure": this.doctype.execution,
      "parameters": {
      }
    }
    this._subscription.add(
      this._userService.getDataSp(newConsult).subscribe((res: any) => {
        if (!res.error) {
          if (res.data.length) {
            res.data.forEach((value: any, index: number) => {
             if (index === 0) {
               this.Grados.push({id: value.id, value: value.sections, status: true})
             } else {
               this.Grados.push({id: value.id, value: value.sections, status: false})
             }
            });
          }
        } else {

        }
      })
    )
  }

  public getDateSpGrapic(id: number) {
    this.showTable.emit(false)
    const newConsult = {
      "procedure": this.doctype.execution_garps,
      "parameters": {
        "value": id.toString(),
      }
    }
    this._subscription.add(
      this._userService.getDataSp(newConsult).subscribe((res: any) => {
        if (!res.error) {
          if (res.data.length) {
            styleTableUser.dataSource = [];
            res.data.forEach((user: any) => {
              const newUser = {
                value: user,
                value1: user.dni,
                value2: user.username,
                value3: user.names,
                value4: user.lastnames,
                value5: user.sexo === 'M' ? 'Masculino' : 'Femenino',
                value6: user.email,
              }
              styleTableUser.dataSource?.push(newUser);
            })
            this.changeStatus(id);
          }

        } else {

        }
      })
    )
  }

  public getDateSpGrapicOne(id: number) {
    const newConsult = {
      "procedure": this.doctype.first_value,
      "parameters": {
        "value": id.toString(),
      }
    }
    dataPieGraphics.length = 0;
    this._subscription.add(
      this._userService.getDataSp(newConsult).subscribe((res: any) => {
        if (!res.error) {
          if (res.data.length) {
            const valueExtractCard: string[] = this.doctype.second_value.split(',')
            dataPieGraphics.push({name:valueExtractCard[0], y: res.data[0].percentage, sliced: false, selected: false})
            dataPieGraphics.push({name:valueExtractCard[1], y: res.data[0].rest_percentage, sliced: false, selected: false})
            this.showTable.emit(true)
          }

        } else {

        }
      })
    )
  }

  public changeStatus(id: number) {
    this.Grados.forEach((item: any) => {
      if (item.id == id) {
        item.status = true
      } else {
        item.status = false
      }
    })
  }
}
