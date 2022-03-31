import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dataset-create-edit',
  templateUrl: './dataset-create-edit.component.html',
  styleUrls: ['./dataset-create-edit.component.scss']
})
export class DatasetCreateEditComponent implements OnInit {

  public isOutside: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
