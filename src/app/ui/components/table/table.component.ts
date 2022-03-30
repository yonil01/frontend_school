import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableStyle: TableModel;
  @Output() dataReturn = new EventEmitter<any>();
  public valueSelect: number;
  public rangeMin: number;
  public rangeMax: number;
  public items: any[]

  constructor() {
    this.tableStyle = {
      columns: [],
      type: 1,
      isSearch: false,
      buttonTittle: {
        showButton: false,
        label: '',
        route: ''
      },
      dataSource: [],
      options: []
    }

    this.items =[];
    this.rangeMin = 0;
    this.rangeMax = 5;
    this.valueSelect =  5;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
  }

  public showChangeTable(e: any): void {
    this.valueSelect = Number(e);
    this.rangeMin = 0;
    this.rangeMax = e;
  }

  public showNextTable(): void {
    if (this.rangeMin === 0) {
      this.rangeMin = this.valueSelect;
      this.rangeMax = this.valueSelect*2;
    } else {
      this.rangeMin = this.rangeMin + this.valueSelect;
      this.rangeMax = this.rangeMax + this.valueSelect;
    }
  }

  public showBackTable() {
    if (this.rangeMin !== 0) {
      this.rangeMin = this.rangeMin - this.valueSelect;
      this.rangeMax = this.rangeMax - this.valueSelect;
    }
  }

  public showSectionNumber(): number {
    // @ts-ignore
    if ((this.tableStyle.type === 2 ? this.tableStyle.dataSources?.length :this.tableStyle.dataSource?.length) <= this.valueSelect) {
      return 1;
    }
    // @ts-ignore
    const newNumber = Math.round((this.tableStyle.type === 2 ? this.tableStyle.dataSources?.length :this.tableStyle.dataSource?.length) / this.valueSelect);
    // @ts-ignore
    const data = ((this.tableStyle.type === 2 ? this.tableStyle.dataSources?.length :this.tableStyle.dataSource?.length) / this.valueSelect) - newNumber;
    if (data >0) {
      return newNumber + 1;
    }
    return newNumber;
  }

  public eventRunOption(data: any, index: number, type: string) {
    const dataReturn = {
      form :data,
      index: index,
      type: type
    }
    this.dataReturn.emit(dataReturn);
  }

}
