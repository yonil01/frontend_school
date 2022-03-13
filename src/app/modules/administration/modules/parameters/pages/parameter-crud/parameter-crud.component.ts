import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {ParametersService} from "@app/modules/administration/modules/parameters/services/parameters.service";
import {CreateParameter} from "@app/modules/administration/modules/parameters/services/parameters.query";
import {Parameters} from "@app/modules/administration/modules/parameters/models/parameters.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "ecapture-ng-ui";
import {Router} from "@angular/router";
import {ToastModel, ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";

@Component({
  selector: 'app-parameter-crud',
  templateUrl: './parameter-crud.component.html',
  styleUrls: ['./parameter-crud.component.scss']
})
export class ParameterCrudComponent implements OnInit {


  private subscription: Subscription = new Subscription();
  public formParameter: FormGroup;
  public toastStyle: ToastStyleModel = toastDataStyle;
  public showBlockPage: boolean = false;

  constructor(
    private parametersService: ParametersService,
    private _fb: FormBuilder,
    private _messageService: ToastService,
    private _router: Router
  ) {
    this.formParameter = _fb.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      value: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      type: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      client_id: ['', [Validators.required, Validators.min(0), Validators.max(100000)]],
      is_cipher: [false, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  public createParameter(): void {
    if (this.formParameter.valid) {
      const parameter: Parameters ={
        ...this.formParameter.value
      }
      this.showBlockPage = true;
      this.subscription.add(
        this.parametersService.createParameter(parameter).subscribe(
          {
            next: (res) => {
              if (res.error) {
                this._messageService.add({type: 'warning', message: res.msg, life: 5000});
              } else {
                this._router.navigateByUrl('/admin/parameters/list');
              }
              this.showBlockPage = false;
            },
            error: (err: Error) => {
              this.showBlockPage = false;
              console.error(err.message);
              this._messageService.add({type: 'warning', message: 'Hubo un problema cuando se trato de obtener la información!', life: 5000});
            }
          }
        )
      )
    } else {
      this._messageService.add({type: 'warning', message: 'Complete todos los campos correctamente', life: 5000});
      this.formParameter.markAllAsTouched();
    }
  }

}
