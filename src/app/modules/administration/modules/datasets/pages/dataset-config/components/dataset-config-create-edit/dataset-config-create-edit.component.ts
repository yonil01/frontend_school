import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {returnEvent} from "@app/modules/administration/modules/datasets/models/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatasetsService} from "@app/modules/administration/modules/datasets/services/datasets.service";
import {ToastService} from "ecapture-ng-ui";
import {DatasetValue} from "@app/core/models";

@Component({
  selector: 'app-dataset-config-create-edit',
  templateUrl: './dataset-config-create-edit.component.html',
  styleUrls: ['./dataset-config-create-edit.component.scss']
})
export class DatasetConfigCreateEditComponent implements OnInit {
  @Input()
  public dataset: any;
  @Input()
  public datasetsValues: any;
  @Input()
  public datasetValue: any
  @Output()
  public onReturn: EventEmitter<returnEvent> = new EventEmitter();
  public isBlockPage: boolean = false;
  public datasetForm: FormGroup;

  constructor(private formBulder: FormBuilder,
              private datasetsService: DatasetsService,
              private messageService: ToastService
  ) {
    this.datasetForm = this.formBulder.group({
      value: ['', Validators.required],
      description: ['', Validators.required],
      code: [''],
      sequence: [''],
    });
  }

  saveDatase(): void {
    if (this.datasetForm.invalid) {
      this.messageService.add({
        type: 'error',
        message: 'Please fill all required fields',
        life: 5000
      });
    } else {
      this.isBlockPage = true;
      this.datasetForm.value.sequence = this.datasetForm.value.sequence
        ? this.datasetForm.value.sequence
        : this.datasetsValues.length + 1;
      this.datasetForm.value.code = this.datasetForm.value.code
        ? this.datasetForm.value.code
        : this.datasetsValues.length + 1;
      const datasetValuePersisten: DatasetValue = {
        ...this.datasetForm.value,
        dataset_id: this.dataset.id.toLowerCase(),
      };
      this.datasetsService.createDatasetValue(datasetValuePersisten).subscribe((res) => {
        if (res.error) {
          this.messageService.add({
            type: 'error',
            message: res.msg,
            life: 5000
          })
          this.isBlockPage = false;
        } else {
          this.datasetForm.reset();
          this.messageService.add({
            type: 'success',
            message: 'Dataset value created successfully',
            life: 5000
          })
          this.isBlockPage = false;
          this.onSubmit();
        }
      });
    }
  }

  changeDatasetValue(): void {
    const datasetValuePersistent: DatasetValue = {
      ...this.datasetForm.value,
      dataset_id: this.dataset.id.toLowerCase(),
      id: this.datasetValue.id
    };
    this.isBlockPage = true;
    this.datasetsService.updateDatasetValue(datasetValuePersistent).subscribe((res) => {
      if (res.error) {
        this.messageService.add({
          type: 'error',
          message: res.msg,
          life: 5000
        })
        this.isBlockPage = false;
      } else {
        this.messageService.add({
          type: 'success',
          message: 'Valor actualizado con éxito',
          life: 5000
        })
        this.isBlockPage = false;
        this.onSubmit();
      }
    });
  }

  onSubmit() {
    this.onReturn.emit({
      id: 'valuesList',
      from: 'createValueSuccess'
    });
  }

  onReturnClick() {
    this.onReturn.emit({
      id: 'valuesList',
      from: 'createValue'
    });
  }

  ngOnInit(): void {
    if (this.datasetValue) {
      this.datasetForm.patchValue(this.datasetValue);
    }
  }

  onSubmitForm() {
    if (this.datasetValue) {
      this.changeDatasetValue();
    } else {
      this.saveDatase();
    }
  }
}
