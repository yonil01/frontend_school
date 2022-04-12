import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {returnEvent} from "@app/modules/administration/modules/datasets/models/models";
import {FormBuilder, Validators} from "@angular/forms";
import { v4 as uuidv4 } from 'uuid';
import {ToastService} from "ecapture-ng-ui";
import {Dataset} from "@app/core/models";
import {cols, fieldTypes} from "@app/modules/administration/modules/datasets/utils/consts";
import {DatasetsService} from "@app/modules/administration/modules/datasets/services/datasets.service";

@Component({
  selector: 'app-dataset-create-edit',
  templateUrl: './dataset-create-edit.component.html',
  styleUrls: ['./dataset-create-edit.component.scss']
})
export class DatasetCreateEditComponent implements OnInit {
  @Input()
  public dataset?: Dataset;
  @Output()
  public onSubmit: EventEmitter<returnEvent> = new EventEmitter();
  public isOutside: boolean = false;
  public datasetForm
  public cols = cols;
  public fieldTypes = fieldTypes;

  constructor(private fb: FormBuilder,
              private messageService: ToastService,
              private datasetsService: DatasetsService) {
    this.datasetForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      field_type: [null, Validators.required],
      max_length: [null, Validators.required],
      outside: [false],
      process: [''],
    });
  }

  onReturn() {
    this.onSubmit.emit({
      id: 'dataset-list',
      from: 'createDataset',
    });
  }

  saveForm(){
    if (this.dataset) {
      this.confirmUpdateEntity();
    } else {
      this.confirmCreateEntity();
    }
  }
  confirmCreateEntity() {
    const datasetPersistent: Dataset = { ...this.datasetForm.value };
      // message: `Los campos \"Nombre\" y \"Tipo de campo\" están especificados como
      //  \"${datasetPersistent.name}\" y \"${datasetPersistent.field_type}\"
      //  los cuales no son editables despues de creado, ¿Está seguro de crear el dataset?`,
        datasetPersistent.id = uuidv4().toLowerCase();
        debugger
        this.datasetsService.createDataset(datasetPersistent).subscribe((res) => {
          if (res.error) {
            this.messageService.add({
              type: 'error',
              message: res.msg,
              life: 5000
            });
          } else {
            this.messageService.add({
              type: 'success',
              message: "Creado con éxito",
              life: 5000
            });
            this.onReturn();
          }
        });
  }
  confirmUpdateEntity() {
      // message: '¿Está seguro de guardar los cambios? Esta acción puede afectar el modelo de datos',
      // header: 'Confirmar Actualización Dataset',
        const datasetPersistent: Dataset = { ...this.dataset, ...this.datasetForm.value, id: this.dataset?.id?.toLowerCase() };
        this.datasetsService.updateDataset(datasetPersistent).subscribe((res) => {
          if (res.error) {
            this.messageService.add({
              type: 'error',
              message: "Error en la actualizacion",
              life: 5000
            });
          } else {
            this.messageService.add({
              type: 'success',
              message: "Actualizado con éxito",
              life: 5000
            });
          this.onReturn();
          }
        });
  }

  ngOnInit(): void {
    if(this.dataset){
      this.datasetForm.patchValue(this.dataset);
      this.datasetForm.controls['name'].disable();
      this.datasetForm.controls['field_type'].disable();
    }
  }

}
