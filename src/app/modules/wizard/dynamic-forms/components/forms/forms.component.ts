import { Component, OnInit } from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {styleTableFirst, styleTableForms} from "@app/modules/wizard/dynamic-forms/models/constans";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  public styleTable: TableModel = styleTableForms;

  constructor( private router: Router){ }

  ngOnInit(): void {
  }

  public eventTableOption(data:any): void {
    if (data.type === 'edit') {
      this.router.navigate(['/wizard/dymanic-forms/edit'])
    } else if (data.type === 'delete') {
      this.styleTable.dataSource?.splice(data.index, 1);
    } else if(data.type === 'normally') {
      this.router.navigate(['/wizard/dymanic-forms/configuration'])
    }

  }

}
