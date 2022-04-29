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
      this.initialRow = parseInt(currentRowPerPage, 10);
      this.currentRowPage.emit(this.initialRow);
      this.initPaginator();
    }
  }

}

/*

import {
  coerceNumberProperty,
  coerceBooleanProperty,
  BooleanInput,
  NumberInput,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  ViewEncapsulation,
  InjectionToken,
  Inject,
  Optional,
  Directive,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {
  HasInitialized,
  mixinInitialized,
  ThemePalette,
  mixinDisabled,
  CanDisable,
} from '@angular/material/core';
import {MatFormFieldAppearance} from '@angular/material/form-field';

const DEFAULT_PAGE_SIZE = 50;

export class PageEvent {

  pageIndex: number = 0;

  previousPageIndex?: number;

  pageSize: number = 0;

  length: number = 0;
}

export interface MatPaginatorDefaultOptions {

  pageSize?: number;

  pageSizeOptions?: number[];

  hidePageSize?: boolean;

  showFirstLastButtons?: boolean;

  formFieldAppearance?: MatFormFieldAppearance;
}

export const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<MatPaginatorDefaultOptions>(
  'MAT_PAGINATOR_DEFAULT_OPTIONS',
);

const _MatPaginatorMixinBase = mixinDisabled(mixinInitialized(class {}));

export interface MatPaginatorSelectConfig {

  disableOptionCentering?: boolean;

  panelClass?: string | string[] | Set<string> | {[key: string]: any};
}

@Directive()
export abstract class _MatPaginatorBase<
  O extends {
    pageSize?: number;
    pageSizeOptions?: number[];
    hidePageSize?: boolean;
    showFirstLastButtons?: boolean;
  },
  >
  extends _MatPaginatorMixinBase
  implements OnInit, OnDestroy, CanDisable, HasInitialized
{
  private _initialized: boolean = false;
  private _intlChanges: Subscription;

  @Input() color: ThemePalette;

  @Input()
  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: NumberInput){
    this._pageIndex = Math.max(coerceNumberProperty(value), 0);
    this._changeDetectorRef.markForCheck();
  }
  private _pageIndex = 0;

  @Input()
  get length(): number {
    return this._length;
  }
  set length(value: NumberInput) {
    this._length = coerceNumberProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _length = 0;

  @Input()
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: NumberInput) {
    this._pageSize = Math.max(coerceNumberProperty(value), 0);
    this._updateDisplayedPageSizeOptions();
  }
  private _pageSize: number = 0;

  @Input()
  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(value: number[] | readonly number[]) {
    this._pageSizeOptions = (value || []).map((p: any) => coerceNumberProperty(p));
    this._updateDisplayedPageSizeOptions();
  }
  private _pageSizeOptions: number[] = [];

  @Input()
  get hidePageSize(): boolean {
    return this._hidePageSize;
  }
  set hidePageSize(value: BooleanInput) {
    this._hidePageSize = coerceBooleanProperty(value);
  }
  private _hidePageSize = false;

  @Input()
  get showFirstLastButtons(): boolean {
    return this._showFirstLastButtons;
  }
  set showFirstLastButtons(value: BooleanInput) {
    this._showFirstLastButtons = coerceBooleanProperty(value);
  }
  private _showFirstLastButtons = false;

  @Input() selectConfig: MatPaginatorSelectConfig = {};

  @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  _displayedPageSizeOptions: number[];

  constructor(
    public _intl: MatPaginatorIntl,
    private _changeDetectorRef: ChangeDetectorRef,
    defaults?: O,
  ) {
    super();
    this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());

    if (defaults) {
      const {pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons} = defaults;

      if (pageSize != null) {
        this._pageSize = pageSize;
      }

      if (pageSizeOptions != null) {
        this._pageSizeOptions = pageSizeOptions;
      }

      if (hidePageSize != null) {
        this._hidePageSize = hidePageSize;
      }

      if (showFirstLastButtons != null) {
        this._showFirstLastButtons = showFirstLastButtons;
      }
    }
  }

  ngOnInit() {
    this._initialized = true;
    this._updateDisplayedPageSizeOptions();
    this._markInitialized();
  }

  ngOnDestroy() {
    this._intlChanges.unsubscribe();
  }

  /!** Advances to the next page if it exists. *!/
  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex + 1;
    this._emitPageEvent(previousPageIndex);
  }

  /!** Move back to the previous page if it exists. *!/
  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /!** Move to the first page if not already there. *!/
  firstPage(): void {
    // hasPreviousPage being false implies at the start
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    this._emitPageEvent(previousPageIndex);
  }

  /!** Move to the last page if not already there. *!/
  lastPage(): void {
    // hasNextPage being false implies at the end
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /!** Whether there is a previous page. *!/
  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }

  /!** Whether there is a next page. *!/
  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }

  /!** Calculate the number of pages *!/
  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  /!**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   *!/
  _changePageSize(pageSize: number) {
    // Current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }

  /!** Checks whether the buttons for going forwards should be disabled. *!/
  _nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  /!** Checks whether the buttons for going backwards should be disabled. *!/
  _previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  /!**
   * Updates the list of page size options to display to the user. Includes making sure that
   * the page size is an option and that the list is sorted.
   *!/
  private _updateDisplayedPageSizeOptions() {
    if (!this._initialized) {
      return;
    }

    // If no page size is provided, use the first page size option or the default page size.
    if (!this.pageSize) {
      this._pageSize =
        this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }

    this._displayedPageSizeOptions = this.pageSizeOptions.slice();

    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }

    // Sort the numbers using a number-specific sort function.
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }

  /!** Emits an event notifying that a change of the paginator's properties has been triggered. *!/
  private _emitPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}

@Component({
  selector: 'mat-paginator',
  exportAs: 'matPaginator',
  templateUrl: 'paginator.html',
  styleUrls: ['paginator.css'],
  inputs: ['disabled'],
  host: {
    'class': 'mat-paginator',
    'role': 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MatPaginator extends _MatPaginatorBase<MatPaginatorDefaultOptions> {
  _formFieldAppearance?: MatFormFieldAppearance;

  constructor(
    intl: MatPaginatorIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS) defaults?: MatPaginatorDefaultOptions,
  ) {
    super(intl, changeDetectorRef, defaults);

    if (defaults && defaults.formFieldAppearance != null) {
      this._formFieldAppearance = defaults.formFieldAppearance;
    }
  }
}
*/
