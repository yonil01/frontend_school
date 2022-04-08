import {Component, OnDestroy, OnInit} from '@angular/core';
import {ParametersService} from "@app/modules/administration/modules/parameters/services/parameters.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Parameters} from "@app/modules/administration/modules/parameters/models/parameters.models";
import {ToastService} from "ecapture-ng-ui";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();
  public showAlert: boolean = false;
  public parameters: Parameters[] = [];

  public isShowBlockPage: boolean = false;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public paginationValue: number = 5;
  public currentLengthPg: number = 0;
  public parametersPagination: Parameters[] = [];
  public leftLimit: number = 0;
  public rightLimit: number = 5;
  public currentPg: number = 1;
  public formParameter: FormGroup;

  public isEditOrCreate: boolean = false;
  public idParameter: number = 0;

  constructor(
    private parametersService: ParametersService,
    private _messageService: ToastService,
    private _fb: FormBuilder,
  ) {
    this.formParameter = _fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      value: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      type: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      client_id: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      is_cipher: [false, Validators.required]
    });
    this.isShowBlockPage = true;
    this.subscription.add(
      this.parametersService.getParameters().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._messageService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              if (res.data) {
                this.parameters = res.data;
                this.initPagination();
              }
            }
            this.isShowBlockPage = false;
          },
          error: (err: Error) => {
            this._messageService.add({
              type: 'error',
              message: 'Hubo un error a la hora de obtener la infomación!',
              life: 5000
            });
            console.error(err.message);
            this.isShowBlockPage = false;
          }
        }
      )
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public deleteParameter(id: number): void {
    this.isShowBlockPage = true;
    this.subscription.add(
      this.parametersService.deleteParameter(id).subscribe({
        next: (res) => {
          if (res.error) {
            this._messageService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this.parameters = this.parameters.filter((parameter) => parameter.id !== id);
            this.initPagination();

          }
          this.isShowBlockPage = false;
          this.showAlert=false;
        },
        error: (err: Error) => {
          this.showAlert = false;
          this.isShowBlockPage = false;
          console.error(err.message);
          this._messageService.add({
            type: 'error',
            message: 'Hubo un error a la hora de obtener la infomación!',
            life: 5000
          });
        }
      })
    );
  }

  private createParameter(): void {
    if (this.formParameter.valid) {
      const parameter: Parameters = {
        ...this.formParameter.value
      }
      this.isShowBlockPage = true;
      this.subscription.add(
        this.parametersService.createParameter(parameter).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                this.isEditOrCreate = false;
                this.parameters.push(res.data);
                this.formParameter.reset();
                this.initPagination();
              }
              this.isShowBlockPage = false;
            },
            error: (err: Error) => {
              this.isShowBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                type: 'warning',
                message: 'Hubo un problema cuando se trato de obtener la información!',
                life: 5000
              });
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formParameter.markAllAsTouched();
    }
  }

  public sendForm(): void {
    if (this.idParameter === 0) {
      this.createParameter();
    } else {
      this.updateParameter();
    }
  }

  private updateParameter(): void {
    if (this.formParameter.valid) {
      const parameter: Parameters = {
        id: this.idParameter,
        ...this.formParameter.value
      }
      this.isShowBlockPage = true;
      this.subscription.add(
        this.parametersService.updateParameters(parameter).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                const indexParameter = this.parameters.findIndex(item => item.id === this.idParameter);
                if (indexParameter !== -1) {
                  this.parameters[indexParameter] = parameter;
                  this.formParameter.reset();
                  this.idParameter = 0;
                  this.initPagination();
                }
                this.isEditOrCreate = false;
              }
              this.isShowBlockPage = false;
            },
            error: (err: Error) => {
              this.isShowBlockPage = false;
              console.error(err.message);
              this._messageService.add({
                type: 'warning',
                message: 'Hubo un problema cuando se trato de obtener la información!',
                life: 5000
              });
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formParameter.markAllAsTouched();
    }
  }

  public isEdit(id: number): void {
    this.isEditOrCreate = true;
    const parameter = this.parameters.find(item => item.id === id);
    if (parameter) {
      this.idParameter = id;
      this.formParameter.patchValue(parameter);
    }
  }

  private initPagination(): void {
    this.leftLimit = 0;
    this.rightLimit = 5;
    this.paginationValue = 5;
    this.currentPg = 1;
    this.currentLengthPg = Math.ceil(this.parameters.length / this.paginationValue);
    this.parametersPagination = this.parameters.slice(this.leftLimit, this.rightLimit);
  }

  public beforePagination(): void {
    this.currentPg--;
    this.leftLimit -= this.paginationValue;
    this.rightLimit -= this.paginationValue;
    this.parametersPagination = this.parameters.slice(this.leftLimit, this.rightLimit);
  }

  public nextPagination(): void {
    this.currentPg++;
    this.leftLimit = this.rightLimit;
    this.rightLimit += this.paginationValue;
    this.parametersPagination = this.parameters.slice(this.leftLimit, this.rightLimit);
  }

  public resetPagination(event: any): void {
    this.paginationValue = parseInt(event.target.value, 10);
    this.leftLimit = 0;
    this.rightLimit = this.paginationValue;
    this.currentPg = 1;
    this.currentLengthPg = Math.ceil(this.parameters.length / this.paginationValue);
    this.parametersPagination = this.parameters.slice(this.leftLimit, this.rightLimit);
  }

  cancelCloseDialog($event: boolean) {
    if ($event) {
      this.deleteParameter(this.idParameter);

    } else {
      this.showAlert = false;
      this.idParameter = 0;
    }
  }

  showDelete(event: number) {
    this.idParameter = event;
    this.showAlert = true;

  }
}
