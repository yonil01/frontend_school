import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {ItemSelectList} from "@app/ui/components/list-select/models/list-select.model";
@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss']
})
export class ListSelectComponent implements OnInit {
  @Input() stileSelectList: ItemSelectList[] = [];
  public selectData: ItemSelectList = {};
  @Output() dataReturn = new EventEmitter<any>();
  Object = Object;

  constructor(private _formBuilder: FormBuilder,  private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    this.selectData = this.stileSelectList[0];
  }

  public eventRunOption(data: any): void {
    this.dataReturn.emit(data);
  }
}
