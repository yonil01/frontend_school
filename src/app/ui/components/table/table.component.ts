import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {Router} from "@angular/router";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableStyle: TableModel;
  @Output() dataReturnOne = new EventEmitter<any>();
  @Output() dataReturn = new EventEmitter<any>();
  @Output() eventButton = new EventEmitter<any>();
  public valueSelect: number;
  public rangeMin: number;
  public rangeMax: number;
  public items: any[];
  public filterTerm!: string;
  fileName: string = 'SheetJS.xlsx';

  constructor(private route: Router) {
    this.tableStyle = {
      columns: [],
      type: 1,
      isSearch: false,
      buttonTittle: {
        showButton: false,
        label: '',
        route: ''
      },
      dataSource: [
      ],
      optionsStander: []
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



  public eventRunOption(data: any) {
    this.dataReturn.emit({value: data.value, type: data.type});
  }

  public emitEventButton(route: string): void {
    if (route === '') {
      this.eventButton.emit(true);
    } else {
      this.route.navigate(['route']);
    }

  }

  public eventRunOptionOne(data: any, type: string): void {
    const dataSend = {
      type: type,
      value: data,
    }
    this.dataReturnOne.emit(dataSend);
  }

  export(): void {
    const ArrayObject:any = [];
    const dataString: string[]=[];
    this.tableStyle.columns.forEach((dat: any, index: number)=> {
      if (index+1!=this.tableStyle.columns.length) {
        dataString.push(dat.label);
      }
    })
    ArrayObject.push(dataString)
    this.tableStyle.dataSource?.filter((user: any) => {
      const ArrayTem = Object.values(user)
      ArrayTem.shift();
      ArrayObject.push(ArrayTem);
    })
    // @ts-ignore
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(ArrayObject);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

}
