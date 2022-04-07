import {Component, Input, OnInit} from '@angular/core';
import {Dataset, DatasetValue} from "@app/core/models";
import {DatasetsService} from "@app/modules/administration/modules/datasets/services/datasets.service";
import {returnEvent} from "@app/modules/administration/modules/datasets/models/models";
import {ToastService} from "ecapture-ng-ui";

@Component({
  selector: 'app-dataset-config-list',
  templateUrl: './dataset-config-list.component.html',
  styleUrls: ['./dataset-config-list.component.scss']
})
export class DatasetConfigListComponent implements OnInit {
  @Input()
  public dataset?: Dataset;
  public datasetsValues: DatasetValue[] = [];
  public showValuesList: boolean = true;
  public showCreateValue: boolean = false;
  public isBlockPage: boolean = false;
  public selectedDatasetValue?: DatasetValue;
  public showDelete: boolean = false;
  public isDeleteAll: boolean = false;

  constructor(private datasetsService: DatasetsService,
              private messageService: ToastService) {
  }

  ngOnInit(): void {
    this.getDatasetsVales();
  }

  returnHome($event: returnEvent) {
    switch ($event.id) {
      case 'valuesList':
        this.showValuesList = true;
        break;
    }
    switch ($event.from) {
      case 'createValue':
        this.showCreateValue = false;
        break;
      case 'createValueSuccess':
        this.showCreateValue = false;
        this.getDatasetsVales();
        break;
    }
  }

  getDatasetsVales(): void {
    this.isBlockPage = true;
    if (this.dataset) {
      if (this.dataset.id) {
        this.datasetsService.getDatasetsValues(this.dataset.id.toString().toLowerCase()).subscribe((res) => {
          this.datasetsValues = res.data ? res.data : [];
          this.isBlockPage = false;
        });
      }
    }
  }

  createValue() {
    if (this.selectedDatasetValue) {
      this.selectedDatasetValue = undefined;
    }
    this.showCreateValue = true;
    this.showValuesList = false;
  }

  onEditValue(i: number) {
    this.selectedDatasetValue = this.datasetsValues[i];
    this.showValuesList = false;
    this.showCreateValue = true;
  }

  sureDeleteAll() {
    this.showDelete = true;
    this.isDeleteAll = true;
  }

  deleteAll() {
    if (this.dataset) {
      if (this.dataset.id) {
        this.isBlockPage = true;
        this.datasetsService.deleteDatasetValueByDatasetID(this.dataset.id.toLowerCase()).subscribe((res) => {
          if (res.error) {
            this.messageService.add({
              type: 'error',
              message: res.msg,
              life: 5000
            });
            this.isBlockPage = false;
            this.isDeleteAll = false;
          } else {
            this.datasetsValues = [];
            this.messageService.add({
              type: 'success',
              message: 'Eliminación exitosa',
              life: 5000
            });
            this.isBlockPage = false;
            this.isDeleteAll = false;
          }
        });
      }
    }
  }

  deleteValues($event: boolean) {
    if ($event) {
      if (this.isDeleteAll) {
        this.deleteAll();
        this.showDelete = false;
      } else {
        this.deleteDataSet();
        this.showDelete = false;
      }
    } else {
      this.showDelete = false;
    }
  }

  onDeleteValue(i: number) {
    this.selectedDatasetValue = this.datasetsValues[i];
    this.showDelete = true;
  }

  deleteDataSet(): void {
    if (this.dataset) {
      if (this.dataset.id) {
        if (this.selectedDatasetValue) {
          if (this.selectedDatasetValue.id) {
            this.isBlockPage = true;
            this.datasetsService.deleteDatasetValue(this.selectedDatasetValue.id, this.dataset.id.toLowerCase()).subscribe((res) => {
                if (res.error) {
                  this.messageService.add({
                    type: 'error',
                    message: 'Error en la eliminación' + res.msg,
                    life: 5000
                  });
                  this.isBlockPage = false;
                } else {
                  this.getDatasetsVales();
                  this.messageService.add({
                    type: 'success',
                    message: 'Eliminación exitosa',
                    life: 5000
                  });
                  this.isBlockPage = false;
                }
              }
            )
          }
        }
      }
    }
  }

  selectListener(file: any) {
    let files: FileList = file.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        this.isBlockPage = true;
        const csv: string = reader.result as string;
        let datasetsValuesPersistense: DatasetValue[] = [];
        datasetsValuesPersistense = csv.split('\n').map((row) => {
          const data = row.split(';');
          data[data.length - 1] = data[data.length - 1].replace('\r', '');
          return {
            value: data[0],
            description: data[1],
            code: +data[2],
            sequence: +data[3],
            dataset_id: this.dataset?.id?.toLowerCase(),
          };
        });
        if(datasetsValuesPersistense[datasetsValuesPersistense.length - 1].value === '') {
          datasetsValuesPersistense.pop();
        }
        this.datasetsService.createDatasetsValues(datasetsValuesPersistense).subscribe((res) => {
          if (res.error) {
            this.messageService.add({
              type: 'error',
              message: 'Error en la creación' + res.msg,
              life: 5000
            });
            this.getDatasetsVales();
            this.isBlockPage = false;
          } else {
            this.datasetsValues = datasetsValuesPersistense;
            this.getDatasetsVales();
            this.messageService.add({
              type: 'success', message: 'Creación Exitosa' + res.msg,
              life: 5000
            });
            this.isBlockPage = false;
          }
        });
      };
    }
  }
}
