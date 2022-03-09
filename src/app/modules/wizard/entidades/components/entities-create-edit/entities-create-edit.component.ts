import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";
import {Entity, Response} from "@app/core/models";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {addEntity} from "@app/core/store/actions/entity.action";

@Component({
  selector: 'app-entities-create-edit',
  templateUrl: './entities-create-edit.component.html',
  styleUrls: ['./entities-create-edit.component.scss']
})
export class EntitiesCreateEditComponent implements OnInit {
  @Output()
  public isReturn: EventEmitter<ReturnData> = new EventEmitter();

  public entity!: Entity;

  constructor(private entityService: EntityService,
              private store: Store<AppState>,
  ) {

  }

  ngOnInit(): void {
  }

  onCancelCreateEntities() {

  }

  onReturn() {
    this.isReturn.emit({
      id: 'create',
      from: 'create',
      value: true
    });
  }

  onCreateEntity(entity: Entity) {
    if (this.entity) {
      const entityPersisten: Entity = JSON.parse(JSON.stringify(this.entity));
      // @ts-ignore
      this.entityService.createEntity(this.entity).subscribe((res: Response) => {
        if (res.error) {
          console.log('error', 'Error en la creación', res.msg, 5000);
        } else {
          console.log('success', 'Creación Exitosa', res.msg, 5000);
          this.store.dispatch(addEntity({entity}));
        }
      });
    }
  }
}
