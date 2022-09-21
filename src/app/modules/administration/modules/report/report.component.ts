import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/store/app.reducers';
import { resetStoreDoctypeGroups } from '@app/core/store/actions/doctype-group.action';
import Split from "split.js";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, OnDestroy {
  public showTable: boolean = false;
  public consultSplit: boolean = true;
  private splitInstance: any;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.initSplit();
  }

  ngOnDestroy() {
    // this.splitInstance.destroy(F);
    this.consultSplit = false;
    this.store.dispatch(resetStoreDoctypeGroups({}));
  }

  public initSplit(): void {
    this.consultSplit = true;
    this.splitInstance = Split(['.left-split', '.right-split'], {
      sizes: [25, 75],
      minSize: [0, 0]
    });
  }

}
