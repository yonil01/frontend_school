import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {Autofill, CascadingDataset, Entity, Response} from "@app/core/models";
import {ToastModel, ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ToastService} from "ecapture-ng-ui";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";

@Component({
  selector: 'app-entity-list-cascade',
  templateUrl: './entity-list-cascade.component.html',
  styleUrls: ['./entity-list-cascade.component.scss']
})
export class EntityListCascadeComponent implements OnInit {
  @Input()
  public entity!: Entity;
  public nameClient: string = '';
  public nameProject: string = '';
  @Output()
  public onReturnList: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  public cascadingDatasets: CascadingDataset[] = [];
  public showCreateEditCascading: boolean = false;
  public selectedCascading!: Autofill;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public isBlock: boolean = false;
  public showCascadingList: boolean = true;
  public isDelete: boolean = false;
  public addAtribute: boolean = false;
  public showAddAttribute: boolean = false;
  public tableIndex: number = 0;
  public currentRowPage: number = 0;
  public cascadingDatasetsTable: any;

  constructor(private _localStorage: LocalStorageService,
              private entityService: EntityService,
              private messageService: ToastService
  ) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
    this.isBlock = true;
    this.entityService.getCascadingDatasets().subscribe((res: Response) => {
      this.cascadingDatasets = [];
      const data = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
      for (const dat of data) {
        if (this.entity.id) {
          if (dat.entities_id.toLowerCase() === this.entity.id.toLowerCase()) {
            dat.showConfig = false;
            this.cascadingDatasets.push(dat);
          }
        }
      }
      this.isBlock = false;
    },);
  }


  onChangeOption(where: string) {
    this.onReturnList.emit({
      id: where,
      from: 'cascadings',
      value: true,
    });
  }

  onCreateEditCascade(cascade?: any) {
    this.showCreateEditCascading = true;
    this.showCascadingList = false;
  }

  toastMessage($event: ToastModel) {
    this.messageService.add($event);
  }

  onShowHome($event: ReturnData) {
    // @ts-ignore
    delete this.selectedCascading;
    this.ngOnInit();
    switch($event.id) {
      case 'cascading':
        this.showCascadingList = true
        break;
    }
    switch ($event.from){
      case 'addAtribute':
        this.addAtribute = false;
        break;
      case 'create':
        this.showCreateEditCascading = false;
        break;
    }
  }

  cancelDelete() {
    this.isDelete = false;
    if (this.selectedCascading) { // @ts-ignore
      delete this.selectedCascading;
    }
  }

  deleteCascade() {
    this.isBlock = true;
    this.isDelete = false;
    if (this.selectedCascading.id) { // @ts-ignore
      this.entityService.deleteCascadingDatasets(this.selectedCascading.id.toLowerCase()).subscribe((res: Response) => {
        if (res.error) {
          this.messageService.add({type: 'error', message: 'Error en la eliminación' + res.msg, life: 5000});
          this.isBlock = false;
        } else {
          this.messageService.add({type: 'success', message: 'Eliminación Exitosa', life: 5000});
          this.isBlock = false;
          this.getCascadingDatasets();
        }
      });
    }
  }

  getCascadingDatasets(): void {
    // @ts-ignore
    this.entityService.getCascadingDatasets().subscribe((res: Response) => {
      this.cascadingDatasets = [];
      const data = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
      for (const dat of data) {
        if (this.entity.id)
          if (dat.entities_id.toLowerCase() === this.entity.id.toLowerCase()) {
            this.cascadingDatasets.push(dat);
          }
      }
    });
  }

  sureDelete(cascade: any) {
    if (this.selectedCascading) { // @ts-ignore
      delete this.selectedCascading;
    }
    this.selectedCascading = this.cascadingDatasets[this.cascadingDatasets.indexOf(cascade)];
    this.isDelete = true;
  }

  showConfig(cascade: any) {
    this.selectedCascading = this.cascadingDatasets[this.cascadingDatasets.indexOf(cascade)];
    this.selectedCascading.showConfig = !this.selectedCascading.showConfig;
  }

  onAddAtributes(cascade: any) {
    this.selectedCascading = this.cascadingDatasets[this.cascadingDatasets.indexOf(cascade)];
    this.addAtribute = true;
    this.showCascadingList = false;
  }
  getData($event: any) {
    this.cascadingDatasetsTable = $event;
  }

  getCurrentRowPage($event: number) {
    if (this.tableIndex == 1) {
      this.currentRowPage = 0;
    } else {
      this.currentRowPage = $event;
    }
  }

  getCurrentPage($event: number) {
    this.tableIndex = $event;
  }
}
