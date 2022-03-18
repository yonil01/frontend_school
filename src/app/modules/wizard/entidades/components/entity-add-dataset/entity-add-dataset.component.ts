import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attribute, Dataset} from "@app/core/models";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EntityService} from "@app/modules/wizard/entidades/services/entities.service";
import {Store} from "@ngrx/store";
import {AppState} from "@app/core/store/app.reducers";
import {DatasetsService} from "@app/modules/wizard/entidades/services/datasets/datasets.service";
import {editAttribute} from "@app/core/store/actions/entity.action";
import {v4 as uuidv4} from 'uuid';
import {ReturnData} from "@app/modules/wizard/entidades/models/entities.models";

@Component({
  selector: 'app-entity-add-dataset',
  templateUrl: './entity-add-dataset.component.html',
  styleUrls: ['./entity-add-dataset.component.scss']
})
export class EntityAddDatasetComponent implements OnInit {
  @Input() attribute?: Attribute;
  @Output()
  public onSubmit: EventEmitter<ReturnData> = new EventEmitter<ReturnData>();
  @Output()
  public message = new EventEmitter();
  public datasets: Dataset[] = [];
  public datasetForm: FormGroup;
  public datasetsLoaded: boolean = false;

  constructor(private datasetsService: DatasetsService,
              private entityService: EntityService,
              private store: Store<AppState>,
              private _fb: FormBuilder) {
    this.datasetForm = this._fb.group({
      dataset: new FormControl()
    });
  }

  ngOnInit(): void {
    this.datasetsService.getDatasets().subscribe((res) => {
      this.datasets = res.data;
      this.datasetsLoaded = true;
      if (this.attribute?.entities_attributes_dataset) {
        const dataset = this.datasets.find(
          (dts) => dts.id?.toLowerCase() === this.attribute?.entities_attributes_dataset?.id?.toLowerCase(),
        );
        this.datasetForm.get('dataset')?.setValue(dataset?.id);
      } else {
        this.datasetForm.get('dataset')?.value.setValue(null);
      }
    });
  }

  async save() {
    if (this.attribute?.entities_attributes_dataset) {
      await this.deleteAttributeDataset();
    }
    if (this.datasetForm.value) {
      const attributeDatasetPersistence = {
        id: uuidv4().toLowerCase(),
        attributes_id: this.attribute?.id?.toLowerCase(),
        dataset_id: this.datasetForm.get('dataset')?.value.toLowerCase(),
      };
      this.entityService.createAttributeDataset(attributeDatasetPersistence).subscribe((res) => {
        if (!res.error) {
          const attribute = {...this.attribute, entities_attributes_dataset: this.datasetForm.get('dataset')?.value};
          this.store.dispatch(editAttribute({attribute: attribute}));
          debugger
          this.datasetForm.get('dataset')?.setValue(null);
          debugger
          this.message.emit({
            type: 'success',
            message: 'Cambios guardados con éxito',
            life: 5000
          })
          this.onSubmit.emit({
            id: 'atribute',
            from: 'addDataset',
            value: true
          });
        } else {
          this.message.emit({
            type: 'error',
            message: res.error,
            life: 5000
          })
        }
      });
    } else {
      const attribute: any = {...this.attribute, entities_attributes_dataset: null};
      this.store.dispatch(editAttribute({attribute: attribute}));
      this.onSubmit.emit({
        id: 'atribute',
        from: 'addDataset',
        value: true
      });
    }
  }

  deleteAttributeDataset(): Promise<any> {
    return new Promise((resolv, rej) => {
      this.entityService
        .DeleteAttributeDatasetByAttIDAndDatasetID(
          this.attribute?.id?.toLowerCase() || '',
          this.attribute?.entities_attributes_dataset?.id?.toLowerCase() || '',
        )
        .subscribe((res) => {
          if (res.error) {
            this.message.emit({
              type: 'error',
              message: res.msg,
              life: 5000
            })
            rej(true);
            resolv(!res.error);
          } else {
            this.message.emit({
              type: 'success',
              message: 'Cambios guardados con éxito',
              life: 5000
            })
            this.onSubmit.emit({
              id: 'atribute',
              from: 'addDataset',
              value: true
            });
          }
        });
    });
  }

  cancel(): void {
    this.onSubmit.emit({
      id: 'atribute',
      from: 'addDataset',
      value: true
    });
  }

}
