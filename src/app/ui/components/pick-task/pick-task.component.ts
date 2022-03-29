import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PickTaskModels} from "@app/ui/components/pick-task/pick-task.models";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {FilterService} from "@app/ui/services/filter.service";

@Component({
  selector: 'app-pick-task',
  templateUrl: './pick-task.component.html',
  styleUrls: ['./pick-task.component.scss']
})
export class PickTaskComponent implements OnInit, OnChanges {

  @Input('source-task') source: PickTaskModels = {title: '', data: []};
  @Input('target-task') target: PickTaskModels = {title: '', data: []};
  @Input('is-disabled') isDisabled: boolean = false;
  @Input('filter') filter: boolean = false;
  @Input('optional-label') optionalLabel: string = 'name';
  @Input('optional-value') optionalValue: string = 'id';

  @Output('on-assign') onAssign: EventEmitter<string[]> = new EventEmitter();
  @Output('un-assign') unAssign: EventEmitter<string[]> = new EventEmitter();
  @Input('filter-mode') filterMatchMode: string = "contains";

  public itemsSelectedAssign: string[] = [];
  public itemsSelectedUnAssign: string[] = [];

  public sourceToDisplay: PickTaskModels = {title: '', data: []};
  public targetToDisplay: PickTaskModels = {title: '', data: []};

  constructor(
    private _filterService: FilterService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('source') && !changes.source.firstChange) {
      this.source = changes.source.currentValue;
      this.sourceToDisplay.data = this.source.data;
    }
    if (changes.hasOwnProperty('target') && !changes.target.firstChange) {
      this.target = changes.target.currentValue;
      this.targetToDisplay.data = this.target.data;
    }
  }

  ngOnInit(): void {
    this.targetToDisplay.data = this.target.data;
    this.sourceToDisplay.data = this.source.data;
  }

  public onAssignItem(): void {
    this.onAssign.emit(this.itemsSelectedAssign);
    this.itemsSelectedAssign = [];
  }

  public unAssignItem(): void {
    this.unAssign.emit(this.itemsSelectedUnAssign);
    this.itemsSelectedUnAssign = [];
  }

  public selectedItemAssign(event: any, id: string): void {
    if (event.target.checked) {
      this.itemsSelectedAssign.push(id);
    } else {
      this.itemsSelectedAssign = this.itemsSelectedAssign.filter(item => item !== id);
    }
  }

  public selectedItemUnAssign(event: any, id: string): void {
    if (event.target.checked) {
      this.itemsSelectedUnAssign.push(id);
    } else {
      this.itemsSelectedUnAssign = this.itemsSelectedUnAssign.filter(item => item !== id);
    }
  }

  public endDrop(event: CdkDragDrop<string[]>, source: string): void {
    if (event.previousContainer !== event.container) {
      if (source === 'target') {
        this.itemsSelectedAssign = this.itemsSelectedAssign.filter(item => item !== event.item.element.nativeElement.id);
        this.onAssign.emit([event.item.element.nativeElement.id]);
      } else {
        this.itemsSelectedUnAssign = this.itemsSelectedUnAssign.filter(item => item !== event.item.element.nativeElement.id);
        this.unAssign.emit([event.item.element.nativeElement.id]);
      }
    }
  }

  public filterItemsTarget(event: any, dataToFilter: any): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name' || this.optionalLabel || 'label').split(',');
      this.targetToDisplay.data = this._filterService.filter(dataToFilter, searchFields, filterValue, this.filterMatchMode);
    } else {
      this.targetToDisplay.data = this.target.data;
    }
  }

  public filterItemsSource(event: any, dataToFilter: any[]): void {
    const filterValue = event.target.value;
    if (filterValue && filterValue.length) {
      const searchFields: string[] = ('name' || this.optionalLabel || 'label').split(',');
      this.sourceToDisplay.data = this._filterService.filter(dataToFilter, searchFields, filterValue, this.filterMatchMode);
    } else {
      this.sourceToDisplay.data = dataToFilter;
    }
  }

}
