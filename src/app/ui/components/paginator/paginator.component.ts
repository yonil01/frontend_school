import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input('rows-per-page') rowsPerPage: number[] = [5, 10, 15, 20];
  @Input('data') data: any[] = [];
  @Input('initial-row') initialRow: number = 0;
  @Output('current-page') currentPageEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output('current-row-page') currentRowPage: EventEmitter<number> = new EventEmitter<number>();
  @Output('current-data-page') currentDataPage: EventEmitter<any[]> = new EventEmitter<any[]>();
  public currentPage = 1;
  public totalPagesInformation: number = 1;
  public leftLimit: number = 0;
  public rightLimit: number = 0;
  public dataDisplay: any[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('data') && !changes.data.firstChange) {
      this.data = changes.data.currentValue;
      this.initPaginator();
    }
    if (changes.hasOwnProperty('rowsPerPage') && !changes.rowsPerPage.firstChange) {
      this.rowsPerPage = changes.rowsPerPage.currentValue;
      this.initPaginator();
    }
    if (changes.hasOwnProperty('initialRow') && !changes.initialRow.firstChange) {
      this.initialRow = changes.initialRow.currentValue;
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    this.currentPage = 1;
    this.initialRow = this.initialRow !== 0 ? this.initialRow : this.rowsPerPage[0];
    this.leftLimit = 0;
    this.rightLimit = this.initialRow;
    this.totalPagesInformation = Math.ceil(this.data.length / this.initialRow);
    this.currentDataPage.emit(this.data.slice(this.leftLimit, this.initialRow));
    this.currentPageEmit.emit(this.currentPage);
  }

  public nextPage(): void {
    this.leftLimit += this.initialRow;
    this.rightLimit += this.initialRow;
    this.currentPage++;
    this.currentPageEmit.emit(this.currentPage);
    this.currentDataPage.emit(this.data.slice(this.leftLimit, this.rightLimit));
  }

  public previousPage(): void {
    this.leftLimit -= this.initialRow;
    this.rightLimit -= this.initialRow;
    this.currentPage--;
    this.currentPageEmit.emit(this.currentPage);
    this.currentDataPage.emit(this.data.slice(this.leftLimit, this.rightLimit));
  }

  public changeRowPerPage(event: any): void {
    const currentRowPerPage = event.target.value;
    if (currentRowPerPage) {
      this.initialRow = currentRowPerPage;
      this.currentRowPage.emit(this.initialRow);
      this.initPaginator();
    }
  }

}
