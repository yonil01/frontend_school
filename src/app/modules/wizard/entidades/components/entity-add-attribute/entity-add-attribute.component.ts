import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attribute, AttributeAutofill, Autofill, CascadingDataset, Entity} from "@app/core/models";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {ToastModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";
import {v4 as uuidv4} from 'uuid';
import {
  CascadingdatasetsService
} from "@app/modules/wizard/entidades/services/cascadingdatasets/cascadingdatasets.service";
import {AttributeCascadingDatasets} from "@app/core/models/config/cascadingdatasets";

@Component({
  selector: 'app-entity-add-attribute',
  templateUrl: './entity-add-attribute.component.html',
  styleUrls: ['./entity-add-attribute.component.scss']
})
export class EntityAddAttributeComponent implements OnInit {
  @Input()
  public entity?: Entity;
  @Input()
  public selectedAutofill?: Autofill;
  @Input()
  public selectedCascading?: CascadingDataset;
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Output()
  public message: EventEmitter<ToastModel> = new EventEmitter();
  @Input()

  public attributesAvailable: Attribute[] = [];
  public attributesSelected: Attribute[] = [];
  public attributeAutofills = [];
  public isBlock: boolean = false;
  public containValues: boolean = false;
  public attribInicial: Attribute[] = [];
  public attribSourceInicial: Attribute[] = [];
  public attributeCascading?: any;
  public sequences?: any;


  constructor(
    private autofillsService: AutofillsService,
    private cascadingdatasetsService: CascadingdatasetsService
  ) {
  }

  ngOnInit(): void {
    if (this.selectedAutofill) {
      this.getAutofillValues();
      this.getAutofills();
    } else if (this.selectedCascading) {
      this.getCascadingdatasets();
    }
  }

  getCascadingdatasets(): void {
    this.isBlock = true;
    const attributes = this.entity?.attributes ? JSON.parse(JSON.stringify(this.entity.attributes)) : [];
    this.cascadingdatasetsService.getAttributeCascadingDataset().subscribe((res) => {
      this.attributesSelected = [];
      this.attributesAvailable = [];
      this.sequences = [];
      this.attribInicial = [];
      this.attribSourceInicial = [];
      this.attributeCascading = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
      for (const at of attributes) {
        if (this.attributeCascading.find((att: any) => at.id.toLowerCase() === att.attribute.id.toLowerCase())) {
          this.attributesSelected.push(at);
          this.attributesSelected.sort((a: any, b: any) => a.sequence - b.sequence);
          this.attribInicial.push(at);
          this.attribInicial.sort((a: any, b: any) => a.sequence - b.sequence);
        } else {
          this.attributesAvailable.push(at);
          this.attributesAvailable.sort((a: any, b: any) => a.sequence - b.sequence);
          this.attribSourceInicial.push(at);
          this.attribSourceInicial.sort((a: any, b: any) => a.sequence - b.sequence);
        }
        this.isBlock = false;
      }
    }, (err) => {
      this.isBlock = false;
      this.message.emit({
        message: err.error.message,
        type: 'error',
        life: 5000
      });
    });
  }

  onReturn() {
    if (this.selectedAutofill) {
      this.isReturn.emit({
        id: 'autofills',
        from: 'addAtribute',
        value: true
      });
    } else if (this.selectedCascading) {
      this.isReturn.emit({
        id: 'cascading',
        from: 'addAtribute',
        value: true
      });
    }
  }

  drop(event: CdkDragDrop<Attribute[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    let updateArray: Array<any> = [];
    copyArrayItem(event.container.data, updateArray, event.currentIndex, event.previousIndex);
    switch (event.container.id) {
      case 'available':
        this.onMoveToAvailable(updateArray);
        break;
      case 'selected':
        this.onMoveToSelected(updateArray);
        break;
    }
  }

  onSubmit() {
    if (this.selectedAutofill) {
      this.isReturn.emit({
        id: 'autofill',
        from: 'addAtribute',
        value: true
      });
    } else if (this.selectedCascading) {
      this.isReturn.emit({
        id: 'cascading',
        from: 'addAtribute',
        value: true
      });
    }
  }

  onCancel() {
    if (this.selectedAutofill) {
      this.isReturn.emit({
        id: 'autofill',
        from: 'addAtribute',
        value: true
      });
    } else if (this.selectedCascading) {
      this.isReturn.emit({
        id: 'cascading',
        from: 'addAtribute',
        value: true
      });
    }
  }

  allToAvailable() {
    this.onMoveToAvailable(this.attributesSelected);
  }

  oneToAvailable() {
    let idToDelete = [];
    for (const at of this.attributesSelected) {
      if (at.selected) {
        at.selected = false;
        idToDelete.push(at.id);
      }
    }
    let toUpdate: Array<any> = [];
    idToDelete.forEach((id) => {
      toUpdate.push(this.attributesSelected.find(at => at.id === id))
    });
    this.onMoveToAvailable(toUpdate);
  }

  allToSelected() {
    this.onMoveToSelected(this.attributesAvailable);
  }

  oneToSelected() {
    let idToDelete = [];
    for (const at of this.attributesAvailable) {
      if (at.selected) {
        at.selected = false;
        idToDelete.push(at.id);
      }
    }
    const toUpdate: Array<any> = []
    idToDelete.forEach((id) => {
      toUpdate.push(this.attributesAvailable.find(at => at.id === id))
    });
    this.onMoveToSelected(toUpdate);
  }

  selectAtribute(from: string, i: number) {
    switch (from) {
      case 'available':
        this.attributesAvailable[i].selected = !this.attributesAvailable[i].selected
        break;
      case 'selected':
        this.attributesSelected[i].selected = !this.attributesSelected[i].selected
        break;
    }
  }

  onMoveToSelected(attributes: Attribute[]): void {
    let nOfAttributes = attributes.length;
    let nOfAtrributesMoved = 1;
    this.isBlock = true;
    if (this.selectedAutofill) {
      for (const at of attributes) {
        const attributpAutofill: AttributeAutofill = {
          id: uuidv4().toLowerCase(),
          attributes_id: at.id?.toLowerCase(),
          autofills_id: this.selectedAutofill.id?.toLowerCase(),
          sequence: this.attributesSelected.indexOf(at) + 1,
          is_search: false,
        };
        this.autofillsService.createAttributeAutofill(attributpAutofill).subscribe((res) => {
          if (res.error) {
            this.isBlock = false;
            this.message.emit({type: 'error', message: res.msg, life: 5000});
          } else {
            if (nOfAtrributesMoved == nOfAttributes) {
              this.isBlock = false;
              this.message.emit(
                {type: 'success', message: 'Creación Exitosa' + res.msg, life: 5000});
              this.getAutofills();
            } else {
              nOfAtrributesMoved++;
            }
          }
        });
      }
    } else {
      if (this.selectedCascading) {
        for (const attr of attributes) {
          const attributCascading: AttributeCascadingDatasets = {
            id: uuidv4().toLowerCase(),
            attributes_id: attr.id?.toLowerCase(),
            cascading_dataset_id: this.selectedCascading.id?.toLowerCase(),
            sequence: attributes.indexOf(attr) + 1,
          };
          this.cascadingdatasetsService.createCascadingDatasets(attributCascading).subscribe((res) => {
            if (res.error) {
              this.isBlock = false;
              this.message.emit({type: 'error', message: res.msg, life: 5000});
            } else {
              if (nOfAtrributesMoved == nOfAttributes) {
                this.message.emit({type: 'success', message: 'Creación Exitosa' + res.msg, life: 5000});
                this.isBlock = false;
                this.getCascadingdatasets();
              } else {
                nOfAtrributesMoved++;
              }
            }
          });
        }
      }
    }
  }


  getAutofills(): void {
    this.attributesSelected = [];
    this.attributesAvailable = [];
    const attributes = this.entity?.attributes ? JSON.parse(JSON.stringify(this.entity.attributes)) : [];
    this.isBlock = true;
    if (this.selectedAutofill) {
      this.autofillsService.getAttributeAutofillsByAutofillID(this.selectedAutofill.id?.toLowerCase() || '').subscribe((res) => {
        this.attributeAutofills = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
        for (const at of attributes) {
          if (res.data.find((att: any) => at.id.toLowerCase() === att.attribute.id.toLowerCase())) {
            this.attributesSelected.push(at);
          } else {
            this.attributesAvailable.push(at);
          }
        }
        this.isBlock = false;
      });
    }
  }

  getAutofillValues(): void {
    this.autofillsService.getAllAutofillValues(this.selectedAutofill?.id?.toLowerCase() || '').subscribe((res) => {
      if (res.data?.autofill_response?.length) {
        this.containValues = true;

      } else {
        this.containValues = false;
      }
    });
  }

  onMoveToAvailable(attributes: Attribute[]): void {
    let nOfAttributes = attributes.length;
    let nOfAtrributesMoved = 1;
    this.isBlock = true;
    if (this.selectedAutofill) {
      for (const at of attributes) {
        //Ojo con el id
        // Verificar tipo de dato AtributeAutofill
        const attributeAutofill: any = this.attributeAutofills.find(
          (aa: any) =>
            aa.attribute?.id.toLowerCase() === at.id?.toLowerCase() &&
            aa.autofills.id.toLowerCase() === this.selectedAutofill?.id?.toLowerCase(),
        );
        this.autofillsService.deleteAttributeAutofill(attributeAutofill?.id.toLowerCase()).subscribe((res) => {
          if (res.error) {
            this.isBlock = false;
            this.message.emit({type: 'error', message: res.msg, life: 5000});
          } else {
            if (nOfAtrributesMoved == nOfAttributes) {
              this.isBlock = false;
              this.message.emit(
                {type: 'success', message: 'Creación Exitosa' + res.msg, life: 5000});
              this.getAutofills();
            } else {
              nOfAtrributesMoved++;
            }
          }
        });
      }
    } else if (this.selectedCascading) {
      for (const at of attributes) {
        const attributCascading = this.attributeCascading.find(
          (aa: any) =>
            aa.attribute.id.toLowerCase() === at.id?.toLowerCase() &&
            aa.cascading_dataset.id.toLowerCase() === this.selectedCascading?.id?.toLowerCase(),
        );
        const deleteAtrribute = {
          id: attributCascading.id.toLowerCase(),
          cascading_dataset_id: attributCascading.cascading_dataset.id.toLowerCase(),
          attributes_id: attributCascading.attribute.id.toLowerCase(),
        };
        this.cascadingdatasetsService.deleteAttributeCascadingDataset(deleteAtrribute).subscribe((res) => {
          if (res.error) {
            this.isBlock = false
            this.message.emit({type: 'error', message: res.msg, life: 5000});
          } else {
            if (nOfAtrributesMoved == nOfAttributes) {
              this.isBlock = false;
              this.message.emit({type: 'success', message: 'Creación Exitosa' + res.msg, life: 5000});
              this.getCascadingdatasets();
            } else {
              nOfAtrributesMoved++;
            }
          }
        });
      }
    }
  }
}

