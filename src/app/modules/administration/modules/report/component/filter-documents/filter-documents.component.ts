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
  columnReport,
  dataAreaGraphics, dataCardGraphics, dataPieGraphics,
  dataReport
} from "@app/modules/administration/modules/report/models/constans";
import {ActivatedRoute} from "@angular/router";

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
  public reports: any[] = [];

  private currentProcedure: string = '';
  private _subscription: Subscription = new Subscription();
  public blockPage: boolean = false;
  public formReport: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private docTypeGroupsService: DocTypeGroupsService,
    private doctypeService: DoctypeService,
    private reportService: ReportService,
    private store: Store<AppState>,
    private _messageService: ToastService,
    private _userService: UsersService,
    private rutaActiva: ActivatedRoute
  ) {
    this.formReport = this._formBuilder.group({
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

    this.reports.push({label: replaceAll('dwd', '_', ' '), value: 1});
    const urlTree = this.rutaActiva.snapshot.params.id;
    const jsonDoctypes = localStorage.getItem('doctypes');
    if (jsonDoctypes) {
      const obj = JSON.parse(jsonDoctypes);
      this.doctype = obj.find((value: any) => value.id === Number(urlTree))
    }


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
      this.reportService.getInfoReport(this.currentProcedure, parameters).subscribe(
        (res) => {
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
            message: 'No se pudo obtener la información del reporte, verifique su conexión a internet!',
            life: 5000
          });
        })
    );
  }

  public getDateSp() {
    const newConsult = {
      "procedure": this.doctype.execution,
      "parameters": {
        "value": this.formReport.get('value')?.value,
        "start_date": this.formReport.get('start_date')?.value,
        "end_date": this.formReport.get('end_date')?.value,
      }
    }
    this._subscription.add(
      this._userService.getDataSp(newConsult).subscribe((res: any) => {
        if (!res.error) {
          if (res.data.length) {
            const item = Object.keys(res.data[0])
            item.forEach((i: any) => {
              columnReport.push({header: i, field: i})
            })
            res.data.forEach((data: any) => {
              dataReport.push(data)
              this.showTable.emit(true)
            })
            this.getDateSpGrapic();

          }
        } else {

        }
      })
    )
  }

  public getDateSpGrapic() {
    dataPieGraphics.length = 0;
    dataAreaGraphics.length = 0;
    dataCardGraphics.length = 0;
    const newConsult = {
      "procedure": this.doctype.execution_garps,
      "parameters": {
        "value": this.formReport.get('value')?.value,
        "start_date": this.formReport.get('start_date')?.value,
        "end_date": this.formReport.get('end_date')?.value,
      }
    }
    this._subscription.add(
      this._userService.getDataSp(newConsult).subscribe((res: any) => {
        if (!res.error) {
          if (res.data.length) {
            const data = Object.keys(res.data[0])

            const valueExtract: string[] = this.doctype.first_value.split(',')

            const valueExtractCard: string[] = this.doctype.second_value.split(',')

            data.forEach((value: string) => {
                    if (valueExtract.indexOf(value) === -1) {
                      dataAreaGraphics.push({name: value, data: []})
                    }

            })

            res.data.forEach((item: any) => {
              dataCardGraphics.push({label: valueExtractCard[0], total: item[valueExtractCard[1]].toString(), percentage: item[valueExtractCard[2]].toString(),
                chartOptions: {
                  chart: {
                    type: 'area',
                    backgroundColor: null,
                    borderWidth: 0,
                    margin: [2, 2, 2, 2],
                    height: 60
                  },
                  title: {
                    text: null
                  },
                  subtitle: {
                    text: null
                  },
                  tooltip: {
                    split: true,
                    outside: true
                  },
                  legend: {
                    enabled: false
                  },
                  credits: {
                    enabled: false
                  },
                  exporting: {
                    enabled: false,
                  },
                  xAxis: {
                    labels: {
                      enabled: false,
                    },
                    title: {
                      text: null
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickOptions: []
                  },
                  yAxis: {
                    labels: {
                      enabled: false,
                    },
                    title: {
                      text: null
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickOptions: []
                  },
                  series: [{
                    data: [0, item[valueExtractCard[0]]]
                  }]
                },
                })
              dataPieGraphics.push({name:valueExtractCard[4]+ ' de ' + item[valueExtractCard[1]], y: item[valueExtractCard[5]], sliced: false, selected: false})

              dataAreaGraphics.forEach((values: any) => {
                values.data.push(item[values.name])
              })
            })
          }

        } else {

        }
      })
    )
  }
}
