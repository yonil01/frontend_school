import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() sizeElement: number;
  @Output() valueMax = new EventEmitter<number>();
  @Output() valueMin = new EventEmitter<number>();
  public rangeMin: number;
  public rangeMax: number;
  public valueSelect: number;
  constructor() {
    this.sizeElement = 0;
    this.rangeMin = 0;
    this.rangeMax = 5;
    this.valueSelect =  5;
  }

  ngOnInit(): void {
  }

  public showChangeTable(e: any): void {
    this.valueSelect = Number(e);
    this.rangeMin = 0;
    this.rangeMax = e;
    this.returnValue();
  }

  public showBackTable() {
    if (this.rangeMin !== 0) {
      this.rangeMin = this.rangeMin - this.valueSelect;
      this.rangeMax = this.rangeMax - this.valueSelect;
      this.returnValue();
    }
  }

  public showSectionNumber(): number {
    // @ts-ignore
    if (this.sizeElement <= this.valueSelect) {
      return 1;
    }
    // @ts-ignore
    const newNumber = Math.round(this.sizeElement / this.valueSelect);
    // @ts-ignore
    const data = (this.sizeElement / this.valueSelect) - newNumber;
    if (data >0) {
      return newNumber + 1;
    }
    return newNumber;
  }

  public showNextTable(): void {
    if (this.rangeMin === 0) {
      this.rangeMin = this.valueSelect;
      this.rangeMax = this.valueSelect*2;
    } else {
      this.rangeMin = this.rangeMin + this.valueSelect;
      this.rangeMax = this.rangeMax + this.valueSelect;
    }
    this.returnValue();
  }


  public returnValue(): void {
    this.valueMax.emit(this.rangeMax);
    this.valueMin.emit(this.rangeMin);
  }


}
