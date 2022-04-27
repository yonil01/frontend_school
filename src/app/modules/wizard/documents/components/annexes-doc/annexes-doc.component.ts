import { Component, OnInit } from '@angular/core';
import {Customer, Project} from "@app/core/models";

interface AnnexDoc {
  name: string,
  version: number,
  isActive: boolean,
  selected: boolean
}

@Component({
  selector: 'app-annexes-doc',
  templateUrl: './annexes-doc.component.html',
  styleUrls: ['./annexes-doc.component.scss']
})

export class AnnexesDocComponent implements OnInit {

  private client: Customer;
  private project: Project;
  public nameClient: string = '';
  public nameProject: string = '';

  public annexesDoc: AnnexDoc[] = [];
  public annexesDocForPag: AnnexDoc[] = [];
  public isEdit = false;
  public isConfig = true;
  public isTab1 = true;

  public showOnlyCheckedTab1 = false;
  public showOnlyCheckedTab2 = false;

  constructor() {
    this.project = JSON.parse(sessionStorage.getItem('project') || '');
    this.client = JSON.parse(sessionStorage.getItem('client') || '');
    this.nameClient = this.client.name + '';
    this.nameProject = this.project.name + '';
  }

  ngOnInit(): void {
    this.annexesDoc.push({
      name: 'Persona Jurídica',
      version: 1,
      isActive: true,
      selected: true
    });
    this.annexesDoc.push({
      name: 'Persona Natural',
      version: 2,
      isActive: false,
      selected: false
    });
  }

}
