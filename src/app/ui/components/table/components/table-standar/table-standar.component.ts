import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Column, Option} from "@app/ui/components/table/model/table.model";

@Component({
  selector: 'app-table-standar',
  templateUrl: './table-standar.component.html',
  styleUrls: ['./table-standar.component.scss']
})
export class TableStandarComponent implements OnInit {
  @Input() dataSource: any[];
  @Input() options: Option[];
  @Input() columns: Column[];
  @Input() filterTerm: string;
  @Input() showPagination: boolean;
  @Input() showBorder: boolean;
  @Input() showResponsive: boolean;
  @Output() dataReturn = new EventEmitter<any>();
  public rangeMax: number;
  public rangeMin: number;
  Object = Object;

  constructor() {
    this.dataSource = [];
    this.options = [];
    this.columns = [];
    this.rangeMax = 5;
    this.rangeMin = 0;
    this.showPagination = true;
    this.filterTerm = '';
    this.showBorder = true;
    this.showResponsive = true;
  }

  ngOnInit(): void {
  }

  public eventRunOption(data: any): void {
    this.dataReturn.emit(data);
  }

}
