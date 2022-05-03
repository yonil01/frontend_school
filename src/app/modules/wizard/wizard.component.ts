import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dropStyle} from "@app/core/models/dropdown/dropdown";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomerService} from "@app/core/services/graphql/wizard/customer/customer.service";
import {Client, Project} from "@app/core/models/wizard/wizard";
import {DropdownComponent, ToastService} from "ecapture-ng-ui";
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ConfigElement} from "@app/core/utils/constants/constant";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  providers: [CustomerService]
})
export class WizardComponent implements OnInit, OnDestroy {
  public readonly dropStyle: DropdownModel = dropStyle;
  private _subscription: Subscription = new Subscription();
  public clients: Client[] = [];
  public projects: Project[] = [];
  public projectName: string = '';
  public clientName: string = '';
  public configList: any[] = [];
  //public isDisableGenerated: boolean = true;
  public isGenerate: boolean = false;
  public clientID: string = '';
  public projectID: string = '';

  constructor(
    private _fb: FormBuilder,
    private customerService: CustomerService,
    private _messageService: ToastService
  ) {
    this._subscription.add(
      this.customerService.getCustomers().subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            if (res.data) {
              const data = res.data.filter( (c: Client) => c.projects?.length );
              if (data) this.clients = data;
              if (this.isExistClientAndProject()) this.setInitDropdown();
            } else {
              this._messageService.add({type: 'info', message: 'No hay clientes configurados!', life: 5000});
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this._messageService.add({type: 'error', message: err.message, life: 5000});
        }
      })
    );
    this.configList = ConfigElement;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public isExistClientAndProject = () => sessionStorage.getItem('client') && sessionStorage.getItem('project');

  public getClient = () => JSON.parse(sessionStorage.getItem('client') || '');

  public getProject = () => JSON.parse(sessionStorage.getItem('project') || '');

  public setInitDropdown() {
    this.clientName = this.getClient().name;
    this.projectName = this.getProject().name;
    this.clientID = this.getClient().id;
    this.projects = this.getClient().projects;
    this.projectID = this.getProject().id;
    this.isGenerate = true;
  }

  public selectClient(client: Client): void {
    this.projectID = '';
    this.isGenerate = false;
    if (client) {
      this.clientName = client.name;
      const projects = client.projects;
      this.projects = projects;
      sessionStorage.setItem('client', JSON.stringify(client));
    } else {
      this.isGenerate = false;
      this.projects = [];
      this.clientID = this.projectID = '';
      sessionStorage.removeItem('client');
      sessionStorage.removeItem('project');
    }
  }

  public selectProject(project: Project) {
    if (project) {
      this.isGenerate = true;
      this.projectName = project.name;
      sessionStorage.setItem('project', JSON.stringify(project));
    } else {
      this.isGenerate = true;
      sessionStorage.removeItem('project');
    }
  }

}
