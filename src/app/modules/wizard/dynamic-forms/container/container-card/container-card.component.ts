import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {statusButton} from "@app/modules/wizard/dynamic-forms/models/model-container-cad/model-container-card";
import {
  acTypeIdentification
} from "@app/modules/wizard/dynamic-forms/models/model-container-cad/constans-container-card";
import {
  dataModelFileManager,
  FileManagerModel
} from "@app/modules/wizard/dynamic-forms/models/model-block-option/constans-block-option";
import {deleteDashboard} from "@app/core/store/actions/dynamic-forms.actions";
import {AppState} from "@app/core/store/app.reducers";
import {Store} from "@ngrx/store";
import {ContainerService} from "@app/core/services/graphql/wizard/container/container.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-container-card',
  templateUrl: './container-card.component.html',
  styleUrls: ['./container-card.component.scss']
})
export class ContainerCardComponent implements OnInit {
  public typeIdentificationStyle: DropdownModel = acTypeIdentification;
  public dataFileManager: FileManagerModel = dataModelFileManager;
  public statusButton: statusButton;
  public showGridsterV: boolean = false;
  public formDinamic: FormGroup;
  @Output('show-preview') showPreview = new EventEmitter<boolean>();

  constructor(
    private containerService: ContainerService,
    private _formBuilder: FormBuilder) {
    this.formDinamic = this._formBuilder.group(
      {
        value1: [
          {value: '', disabled: false},
          [],
        ],
        value2: [
          {value: '', disabled: false},
          [],
        ],
      }
    );

    this.statusButton = {
      buttonsArray: [
        {
          name: 'General',
          status: true,
        },
        {
          name: 'Entidad',
          status: false,
        },
      ]
    }
  }

  ngOnInit(): void {
  }

  public showContainer(index: number, indexChild: number): boolean {
    if (this.dataFileManager.folder[index].documents[indexChild].option.show) {
      return true;
    } else {
      return false;
    }
  }

  public showNotContainer(): boolean {
    let valueShow: boolean = false;
    this.dataFileManager.folder.forEach((item) => {
      item.documents.forEach((itemChild) => {
        if (itemChild.option.show) {
          valueShow = true;
        }
      })
    });
    return valueShow;
  }

  public activeButton(index: number): void {
    this.statusButton.buttonsArray.forEach((item: any, i: number) => {
      if (index === i) {
        item.status =  true;
      } else {
        item.status = false;
      }
    })
  }


  public showGridster():void {
    this.showPreview.emit(true);
this.showGridsterV = true;
  }

  public saveForm(event: string) {
    if (event === 'NEWCONTAINER') {
      this.containerService.newContainer('87bd520d-8e2a-42b9-848f-4591912cfb1f', this.formDinamic.get('value1')?.value, 1, 1,1,'background: red', 1).subscribe((res) => {
      });
    }
  }


}
