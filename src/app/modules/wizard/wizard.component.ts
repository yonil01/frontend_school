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
  public clients: DataDrop[] = [];
  public projects: DataDrop[] = [];
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
              console.log(res.data);
              const data = res.data.filter((c: Client) => c.projects?.length);
              if (data) this.clients = data.map((client: Client) => ({
                label: client.name,
                value: client
              }));
            } else {
              this._messageService.add({type: 'info', message: 'No hay clientes configurados!', life: 5000});
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
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

  public selectClient(client: any): void {
    if (client) {
      if(client.name !== this.clientName){
        this.projectID = '';
      }
      this.clientName = client.name;
      const projects = client.projects;
      this.projects = projects.map((project: Project) => ({label: project.name, value: project}));

    } else {
      //this.isDisableGenerated = true;
      this.isGenerate = false;
      this.projects = [];
      this.projectID = '';
      this.clientID = '';
    }
    sessionStorage.setItem('client', JSON.stringify(client));
  }

  public selectProject(project: any) {
    if (project) {
      this.projectName = project.name;
      //this.isDisableGenerated = false;
    } else {
      //this.isDisableGenerated = true;
      this.isGenerate = false;
    }
    sessionStorage.setItem('project', JSON.stringify(project));
  }

}
