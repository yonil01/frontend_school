import {Component, OnInit} from '@angular/core';
import {Dataset} from "@app/core/models";
import {cols, fieldTypes} from "@app/modules/administration/modules/datasets/utils/consts";
import {DatasetsService} from "@app/modules/administration/modules/datasets/services/datasets.service";

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {
  public datasets: Dataset[] = [];
  public dataset?: Dataset;
  public cols = cols;
  public fieldTypes = fieldTypes;

  constructor(private datasetsService: DatasetsService,
  ) {
  }

  ngOnInit(): void {
    this.getDatasets();
  }

  private getDatasets(): void {
    this.datasetsService.getDatasets().subscribe((res) => {
      if (res.error) {
        console.log("Hubo un error");
      }
      this.datasets = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
      console.log(this.datasets);
    });
  }


}
