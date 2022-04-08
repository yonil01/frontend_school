import {Component, OnInit} from '@angular/core';
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomerService} from "@app/core/services/graphql/wizard/customer/customer.service";
import {Client, Project} from "@app/core/models/wizard/wizard";
import {DropdownComponent} from "ecapture-ng-ui";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [CustomerService]
})
export class WizardComponent implements OnInit {
  public dropStyle: DropdownModel = dropStyle;

  clients!: DataDrop[];
  projects!: DataDrop[];

  items = [];
  configList: any = [];
  display = false;

  isDisableGenerated = true;
  isGenerate = false;

  isOpenModalExport = false;
  isOpenModalImport = false;

  constructor(private _fb: FormBuilder, private customerService: CustomerService) {

    this.customerService.getCustomers().subscribe((res) => {
      const data = res.data.filter((c: Client) => c.projects?.length);
      if (data) this.clients = data.map((client: Client) => ({
        label: client.name,
        value: client
      }))
    });

    this.configList = [
      {
        name: 'Entidades',
        icon: '../../../assets/img/entities-icon.svg',
        description: 'Presione aquí para configurar lo correspondiente a entidades.',
        route: 'entities',
      },
      {
        name: 'Documentos',
        icon: '../../../assets/img/documents-icon.svg',
        description: 'Presione aquí para configurar lo correspondiente a documentos.',
        route: 'documents',
      },
      {
        name: 'Formularios',
        icon: '../../../assets/img/forms-icon.svg',
        description: 'Presione aquí para configurar lo correspondiente a formularios.',
        route: 'dymanic-forms',
      },
      {
        name: 'BPMN',
        icon: '../../../assets/img/bpmns-icon.svg',
        description: 'Presione aquí para configurar lo correspondiente a procesos.',
        route: 'bpmn',
      },
      {
        name: 'Roles',
        icon: '../../../assets/img/roles-icon.svg',
        description: 'Presione aquí para configurar lo correspondiente a roles.',
        route: 'roles',
      },
      {
        name: 'Almacenamiento físico',
        icon: '../../../assets/img/storages-icon.svg',
        description: 'Presione aquí para configurar lo correspondiente a almacenamiento físico.',
        route: 'roles',
      }
    ];

  }

  ngOnInit(): void {
  }

  selectClient(client: any, dropdown: DropdownComponent) {
    if (client) {
      const projects = client.projects;
      this.projects = projects.map((project: Project) => ({label: project.name, value: project}))
    } else {
      this.isDisableGenerated = true;
      this.isGenerate = false;
      this.projects = []
      dropdown.clearValue();
    }
    sessionStorage.setItem('client', JSON.stringify(client));

  }

  selectProject(project: any) {
    if (project) {
      this.isDisableGenerated = false;
    } else {
      this.isDisableGenerated = true;
      this.isGenerate = false;
    }
    sessionStorage.setItem('project', JSON.stringify(project));
  }

  routeComponent(route: string): void {
    // this.router.navigate([route], {relativeTo: this.route}).then((_) => {});
  }

}
