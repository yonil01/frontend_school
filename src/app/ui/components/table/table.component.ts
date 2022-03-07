import {Component, Input, OnInit} from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableStyle: TableModel;
  public valueSelect: number;
  public rangeMin: number;
  public rangeMax: number;
  public sizeArray: number;

  constructor() {
    this.tableStyle = {
      dataSource: [
        {
          value: 'Form 1'
        },
        {
          value: 'Form 2'
        },
        {
          value: 'Form 3'
        },
        {
          value: 'Form 1'
        },
        {
          value: 'Form 2'
        },
        {
          value: 'Form 3'
        },
        {
          value: 'Form 1'
        },
        {
          value: 'Form 2'
        },
        {
          value: 'Form 3'
        }
      ],
      options: [
        {
          icon: 'broad-activity-feed',
          color: 'text-alert-success',
          visibility: true,
        }
      ]
    }

    this.rangeMin = 0;
    this.rangeMax = 5;
    this.valueSelect =  5;
    this.sizeArray = Number(this.tableStyle.dataSource?.length);
  }

  ngOnInit(): void {
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
    if (this.tableStyle.dataSource?.length <= this.valueSelect) {
      return 1;
    }
    // @ts-ignore
    const newNumber = Math.round(this.tableStyle.dataSource?.length / this.valueSelect);
    // @ts-ignore
    const data = (this.tableStyle.dataSource?.length / this.valueSelect) - newNumber;
    if (data >0) {
      return newNumber + 1;
    }
    return newNumber;
  }

}
