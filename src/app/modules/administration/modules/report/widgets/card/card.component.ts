import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import {dataCardGraphics} from "@app/modules/administration/modules/report/models/constans";

@Component({
  selector: 'app-widget-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
 public dataArray: any = []
  Highcharts = Highcharts;
  public dataArrayGraphics: any[] = dataCardGraphics;
  constructor() {
  }

  ngOnInit() {


    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}
