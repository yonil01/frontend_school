import {Component, Input, OnInit} from '@angular/core';
import {
  dataModelFileManager,
  FileManagerModel
} from "@app/modules/wizard/dynamic-forms/models/model-block-option/constans-block-option";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {addGridsterItem} from "@app/core/store/actions/dynamic-forms.actions";

@Component({
  selector: 'app-block-option',
  templateUrl: './block-option.component.html',
  styleUrls: ['./block-option.component.scss']
})
export class BlockOptionComponent implements OnInit {
  @Input() dataModelFileManager: FileManagerModel;
  indexSelectedDashboard: number = 0;
  indexSelectContaner: number = 0;

  constructor(private store: Store<AppState>) {
    this.dataModelFileManager = {
      folder: []
    };
  }

  ngOnInit(): void {
    this.dataModelFileManager = dataModelFileManager;
  }

  ngOnChanges(changes: any) {

  }

  public changeStatusDisplay(index: number) {
    this.dataModelFileManager.folder.forEach((item: any, i:number) => {
      if (index === i) {
        item.display = !item.display;
      } else {
        item.display = false;
      }
    })
  }

  public showSelectedItem(index: number, indexChild: number): void {
    this.dataModelFileManager.folder.forEach((item, i) => {
      item.documents.forEach((itemChild, iChild) => {
        if (index === i && iChild === indexChild) {
          itemChild.option.show = true;
        } else {
          itemChild.option.show = false;
        }
      })
    });
    this.addItem('image');
  }

  addItem(type: string) {
    if (this.indexSelectedDashboard >= 0) {
      const gridsterItem = {
        x: 0,
        y: 0,
        cols: type === 'select' ? 2 : 1,
        rows: 1,
        type: type,
        label: type,
        placeholder: type,
        text: '',
      };
      this.store.dispatch(
        addGridsterItem({
          gridsterItem,
          indexContainer: this.indexSelectContaner,
          indexDashboard: this.indexSelectedDashboard,
        }),
      );
    }
  }

}
