import { Component, OnInit } from '@angular/core';

import {
  GridsterConfig,
  Draggable,
  Resizable,
  PushDirections,
  GridType,
  CompactType,
  GridsterItem,
  GridsterItemComponentInterface,
  DisplayGrid,
} from 'angular-gridster2';

import {
  editIndexDashboard,
  controlEForm,
  editIndexGridsterItem,
  deleteDashboard, deleteGridsterItem
} from '@app/core/store/actions/dynamic-forms.actions';
import {Container, Dashboard} from "@app/modules/wizard/dynamic-forms/models/model-gridster/model-gridster";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {Form} from "@app/core/models/config/form";
import {MenuItem} from "ecapture-ng-ui/lib/modules/header/models/header.models";
import {FormControl} from "@angular/forms";

interface Safe extends GridsterConfig {
  draggable?: Draggable;
  resizable?: Resizable;
  pushDirections?: PushDirections;
}

@Component({
  selector: 'app-gridster',
  templateUrl: './gridster.component.html',
  styleUrls: ['./gridster.component.scss']
})
export class GridsterComponent implements OnInit {
  eform: Form;
  options: Safe;
  optionsList: Safe[] = [];
  selectContainer: Container;
  indexSelectedDashboard: number = 0;
  showConfig = false;
  items: MenuItem[];
  indexSelectContaner: number = 0;
  typeElement: string;
  isVisibletitle: boolean;

  cssForm = new FormControl('{}');
  codeMirrorOptions: any = {
    // theme: 'abcdef',
    theme: 'idea',
    mode: 'text/css',
    lineNumbers: false,
    lineWrapping: false,
    foldGutter: true,
    // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    // matchBrackets: false,
    // lint: false,
    // showHint: true,
    // hint: 'auto',
    // autofocus: true,
    extraKeys: {
      'Ctrl-Space': 'autocomplete',
    },
  };

  constructor(private store: Store<AppState>) {
    this.eform = {};
    this.options = {};
    this.selectContainer = {
      dashboards : [
        {
          gridster:
            {cols: 2, rows: 1, y: 0, x: 0},
        }
      ]
    };
    this.items = [];
    this.typeElement = '';
    this.isVisibletitle = false;
  }

  static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {}

  ngOnChanges() {}

  ngOnInit() {
    this.options = {
      allowMultiLayer: true,
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 6,
      maxCols: 6,
      minRows: 12,
      maxRows: 12,
      maxItemCols: 6,
      minItemCols: 1,
      maxItemRows: 12,
      minItemRows: 1,
      maxItemArea: 36,
      minItemArea: 1,
      defaultItemCols: 2,
      defaultItemRows: 1,
      fixedColWidth: 6,
      fixedRowHeight: 12,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
        stop: GridsterComponent.eventStop,
      },
      resizable: {
        enabled: true,
      },
      swap: true,
      pushItems: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
    };


    this.store.select('dynamicForms').subscribe((state) => {
      this.eform = JSON.parse(JSON.stringify(state.eform));
      this.indexSelectContaner = state.indexContainer;
      this.indexSelectedDashboard = state.indexDashboard;
      if (this.indexSelectContaner !== null) {
        if (this.eform.containers!.length > 0) {
          this.selectContainer = this.eform.containers![this.indexSelectContaner];

          if (this.selectContainer !== undefined) {
            const optionsDiff = this.selectContainer.dashboards!.length - this.optionsList.length;
            for (let i = 0; i <= optionsDiff; i++) {
              this.optionsList.push(JSON.parse(JSON.stringify(this.options)));
            }
          }
          // @ts-ignore
          if (this.eform.containers[0].dashboards.length > 0) {
            // @ts-ignore
            if (this.eform.containers[0].dashboards[0].gridsterItems.length === 0) {
              if (!this.showConfig) {
                this.configComponentDashboard(0, 0);
              }
            }
          }
        }
      }
    });

    this.items = [
      {
        label: 'Item',
        route: '',
        status: false
      },
    ];
  }

  selectedItem(item: any, indexItem: any): void {
    this.store.dispatch(controlEForm({ eform: this.eform }));
  }

  removeItem($event: any, indexItem: number) {
    // $event.preventDefault();
    // $event.stopPropagation();
    // const index = this.dashboard.indexOf(item);
    this.store.dispatch(deleteGridsterItem({ indexItem: indexItem }));
    // this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  configComponent(item: any, index: number) {
    // const index = this.selectContainer.dashboards[this.indexSelectedDashboard].gridsterItems.indexOf(item);
    this.store.dispatch(controlEForm({ eform: this.eform }));
    this.store.dispatch(editIndexGridsterItem({ indexGridsterItem: index }));
    this.showConfig = true;
  }

  selectedDashboard(dashboard: Dashboard, index: number): void {
    if (this.indexSelectedDashboard !== index) {
      this.store.dispatch(controlEForm({ eform: this.eform }));
      this.store.dispatch(editIndexDashboard({ indexDashboard: index }));
    }
    this.indexSelectedDashboard = index;
  }

  configComponentDashboard(item: any, index: number) {
    // const index = this.selectContainer.dashboards[this.indexSelectedDashboard].gridsterItems.indexOf(item);
    this.store.dispatch(controlEForm({ eform: this.eform }));
    this.store.dispatch(editIndexDashboard({ indexDashboard: index }));
    this.showConfig = true;
  }

  removeDashboard($event: any, indexDashboard: any): void {
    this.store.dispatch(deleteDashboard({ indexDashboard: indexDashboard }));
  }
}
