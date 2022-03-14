import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attribute, AttributeAutofill, Autofill, CascadingDataset, Entity} from "@app/core/models";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {ToastModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {AutofillsService} from "@app/modules/wizard/entidades/services/autofills/autofills.service";
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-entity-add-attribute',
  templateUrl: './entity-add-attribute.component.html',
  styleUrls: ['./entity-add-attribute.component.scss']
})
export class EntityAddAttributeComponent implements OnInit {
  @Input()
  public entity: Entity;
  @Input()
  public selectedAutofill!: Autofill;
  @Input()
  public selectedCascading!: CascadingDataset;
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Output()
  public message: EventEmitter<ToastModel> = new EventEmitter();

  public attributesAvailable: Attribute[] = [];
  public attributesSelected: Attribute[] = [];
  public attributeAutofills = [];
  public isBlock: boolean = false;


  constructor(
    private autofillsService: AutofillsService,
  ) {
  }

  ngOnInit(): void {
    this.getAutofills();
  }

  onReturn() {
    this.isReturn.emit({
      id: 'autofills',
      from: 'addAtribute',
      value: true
    });
  }

  drop(event: CdkDragDrop<Attribute[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    let updateArray = [];
    copyArrayItem(event.container.data, updateArray, event.currentIndex, event.previousIndex);
    debugger
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
    this.isReturn.emit({
      id: 'autofill',
      from: 'addAtribute',
      value: true
    });
  }

  onCancel() {
    this.isReturn.emit({
      id: 'autofill',
      from: 'addAtribute',
      value: true
    });
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
    debugger
    let toUpdate = [];
    idToDelete.forEach((id) => {
      toUpdate.push(this.attributesSelected.find(at => at.id === id))
    });
    this.onMoveToAvailable(toUpdate);
    this.getAutofills();

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
    debugger
    const toUpdate = []
    idToDelete.forEach((id) => {
      toUpdate.push(this.attributesAvailable.find(at => at.id === id))
    });
    this.onMoveToSelected(toUpdate);
    this.getAutofills();
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
    for (const at of attributes) {
      const attributpAutofill: AttributeAutofill = {
        id: uuidv4().toLowerCase(),
        attributes_id: at.id.toLowerCase(),
        autofills_id: this.selectedAutofill.id.toLowerCase(),
        sequence: this.attributesSelected.indexOf(at) + 1,
        is_search: false,
      };
      this.isBlock = true;
      this.autofillsService.createAttributeAutofill(attributpAutofill).subscribe((res) => {
        if (res.error) {
          this.isBlock = false;
          this.message.emit({type: 'error', message: res.msg, life: 5000});
        } else {
          this.isBlock = false;
          this.message.emit(
            {type: 'success', message: 'Creación Exitosa' + res.msg, life: 5000});
        }
      });
    }
  }

  getAutofills(): void {
    this.attributesSelected = [];
    this.attributesAvailable = [];
    const attributes = this.entity?.attributes ? JSON.parse(JSON.stringify(this.entity.attributes)) : [];
    this.isBlock = true;
    this.autofillsService.getAttributeAutofillsByAutofillID(this.selectedAutofill.id.toLowerCase()).subscribe((res) => {
      this.attributeAutofills = res.data ? JSON.parse(JSON.stringify(res.data)) : [];
      for (const at of attributes) {
        if (res.data.find((att) => at.id.toLowerCase() === att.attribute.id.toLowerCase())) {
          this.attributesSelected.push(at);
        } else {
          this.attributesAvailable.push(at);
        }
      }
      this.isBlock = false;
    });
  }

  onMoveToAvailable(attributes: Attribute[]): void {
    for (const at of attributes) {
      this.isBlock = true;
      const attributeAutofill = this.attributeAutofills.find(
        (aa) =>
          aa.attribute.id.toLowerCase() === at.id.toLowerCase() &&
          aa.autofills.id.toLowerCase() === this.selectedAutofill.id.toLowerCase(),
      );
      this.autofillsService.deleteAttributeAutofill(attributeAutofill.id.toLowerCase()).subscribe((res) => {
        if (res.error) {
          this.isBlock = false;
          this.message.emit({type: 'error', message: res.msg, life: 5000});
        } else {
          this.isBlock = false;
          this.message.emit(
            {type: 'success', message: 'Creación Exitosa' + res.msg, life: 5000});
        }
      });
    }
  }
}
