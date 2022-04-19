import {Component, OnInit} from '@angular/core';
import {Dataset} from "@app/core/models";
import {DatasetsService} from "@app/modules/administration/modules/datasets/services/datasets.service";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {returnEvent} from "@app/modules/administration/modules/datasets/models/models";

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {
  public datasets: Dataset[] = [];
  public selectedDataset?: Dataset;

  public toastStyle: ToastStyleModel = toastDataStyle;
  public showDatasets: boolean = true;
  public showCreateDataset: boolean = false;
  public showDelete: boolean = false;
  public showConfig: boolean = false;
  public isBlockPage: boolean = false;
  public datasetsTable: any;
  public tableIndex: number = 0;
  public currentRowPage: number = 0;

  constructor(private datasetsService: DatasetsService,
              private messageService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.getDatasets();
  }

  private getDatasets(): void {
    this.isBlockPage = true
    this.datasetsService.getDatasets().subscribe((res) => {
      if (res.error) {
        this.isBlockPage = false
        this.messageService.add({type: 'error', message: res.msg, life: 5000});
      }
      this.isBlockPage = false
      this.datasets = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
    });
  }

  returnHome($event: returnEvent) {
    switch ($event.id) {
      case 'dataset-list':
        this.showDatasets = true;
        break;
    }
    switch ($event.from) {
      case 'createDataset':
        this.getDatasets();
        if (this.selectedDataset) {
          this.selectedDataset = undefined;
        }
        this.showCreateDataset = false;
        break;
    }
  }

  onCreateDataset() {
    if (this.selectedDataset) {
      this.selectedDataset = undefined;
    }
    this.showDatasets = false;
    this.showCreateDataset = true;
  }

  onEditDataset(dataset: any) {
    this.selectedDataset = this.datasets[this.datasets.indexOf(dataset)];
    this.showDatasets = false;
    this.showCreateDataset = true;
  }

  onDeleteDataset(dataset: any) {
    this.selectedDataset = this.datasets[this.datasets.indexOf(dataset)];
    this.showDelete = true;
  }

  onConfigDataset(dataset: any) {
    this.selectedDataset = this.datasets[this.datasets.indexOf(dataset)]
    this.showDatasets = false;
    this.showConfig = true;
  }

  deleteDataset($event: any): void {
    if ($event) {
      if (this.selectedDataset?.id)
        this.datasetsService.deleteDataset(this.selectedDataset.id.toLowerCase()).subscribe((res) => {
          if (res.error) {
            this.messageService.add({
              type: 'error',
              message: res.msg,
              life: 5000
            });
          } else {
            this.messageService.add({
              type: 'success',
              message: 'Dataset deleted successfully',
              life: 5000
            });
            this.showDelete = false
            this.getDatasets();
          }
        });
    } else {
      this.showDelete = false;
    }
  }


  showHome($event: any) {
    this.showDatasets = true;
    this.showConfig = false
  }

  getData($event: any) {
    this.datasetsTable = $event;
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
