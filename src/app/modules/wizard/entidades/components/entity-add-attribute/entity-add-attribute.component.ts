import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Autofill, CascadingDataset} from "@app/core/models";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {ToastModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";

@Component({
  selector: 'app-entity-add-attribute',
  templateUrl: './entity-add-attribute.component.html',
  styleUrls: ['./entity-add-attribute.component.scss']
})
export class EntityAddAttributeComponent implements OnInit {
  @Input()
  public selectedAutofill!: Autofill;
  @Input()
  public selectedCascading!: CascadingDataset;
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Output()
  public message: EventEmitter<ToastModel> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onReturn() {
    this.isReturn.emit({
      id: 'create',
      from: 'create',
      value: true
    });
  }
}
