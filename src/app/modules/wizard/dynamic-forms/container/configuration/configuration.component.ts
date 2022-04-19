import { Component, OnInit } from '@angular/core';
import {ContainerService} from "@app/core/services/graphql/wizard/container/container.service";

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  public showPreview: boolean;

  constructor() {
    this.showPreview = false;
  }

  ngOnInit(): void {
  }



}
