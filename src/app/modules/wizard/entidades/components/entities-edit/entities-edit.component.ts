import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Entity} from "@app/core/models";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Response} from "@app/core/models";
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {editEntity} from "@app/core/store/actions/entity.action";

@Component({
  selector: 'app-entities-edit',
  templateUrl: './entities-edit.component.html',
  styleUrls: ['./entities-edit.component.scss']
})
export class EntitiesEditComponent implements OnInit {
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();
  @Input()
  public selectedEntity!: Entity

  constructor(private store: Store<AppState>,
              private entityService: EntityService) {
  }

  ngOnInit(): void {
  }

  onCancelEditEntity() {
    this.onReturn();
  }

  onReturn() {
    this.isReturn.emit({
      id: 'edit',
      from: 'edit',
      value: true
    });
  }

  editEntity() {
    debugger
    const entityPersisten: Entity = JSON.parse(JSON.stringify(this.selectedEntity));
    delete entityPersisten.project;
    delete entityPersisten.attributes;
    // @ts-ignore
    this.entityService.updateEntity(entityPersisten).subscribe((res: Response) => {
      if (res.error) {
        console.log("Error en la actualización!")
      } else {
        console.log('success', 'Actualización Exitosa', res.msg, 5000);
        this.store.dispatch(editEntity({entity: entityPersisten}));
        this.onReturn()
      }
    });
  }

}
