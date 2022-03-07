import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {MsgModel} from "@app/modules/administration/modules/messages/models/msg.model";
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {ToastService} from "ecapture-ng-ui";
import {Messages} from "@app/core/models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-messages-crud',
  templateUrl: './messages-crud.component.html',
  styleUrls: ['./messages-crud.component.scss']
})
export class MessagesCrudComponent implements OnInit, OnDestroy {

  @Input() msgId: string = '';


  private _subscription: Subscription = new Subscription();

  public formMsg: FormGroup

  constructor(
    private _messageService: MessageServices,
    private _toastService: ToastService,
    private _fb: FormBuilder,
    private _route: Router
  ) {
    this.formMsg = _fb.group({
      msgEsp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      msgEn: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public createMsg(): void {
    if (this.formMsg.valid) {
      const {msgEsp, msgEn, type} = this.formMsg.value;
      const dataMsg: Messages = {
        spa: msgEsp,
        eng: msgEn,
        type_message: type
      };
      this._subscription.add(
        this._messageService.createMsgService(dataMsg).subscribe({
          next: (res) => {
              if (res.error) {
                this._toastService.add({type: 'error', message: res.msg, life: 5000});
              } else {
                this._toastService.add({type: 'success', message: 'Mensage creado correctamente!', life: 500});
                this._route.navigateByUrl('/admin/list');
              }
          },
          error: (err: Error) => {
            console.error(err.message);
            this._toastService.add({type: 'error', message: 'No se pudo obtener la información solicitada, Contactese con el administrador de servicio!', life: 5000});
          }
        })
      );
    } else {
      this._toastService.add({type: 'warning', message: 'Complete todos los campos requeridos!', life: 5000});
      this.formMsg.markAllAsTouched();
    }
  }


  public updateMsg(): void {
    if (this.formMsg.valid) {
      const {msgEsp, msgEn, type} = this.formMsg.value;
      const dataMsg: Messages = {
        id: this.msgId,
        spa: msgEsp,
        eng: msgEn,
        type_message: type
      };
      this._subscription.add(
        this._messageService.updateMsgService(dataMsg).subscribe({
          next: (res) => {
            if (res.error) {
              this._toastService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              this._toastService.add({type: 'success', message: 'Mensage actualizado correctamente!', life: 500});
              this._route.navigateByUrl('/admin/list');
            }
          },
          error: (err: Error) => {
            console.error(err.message);
            this._toastService.add({type: 'error', message: 'No se pudo obtener la información solicitada, Contactese con el administrador de servicio!', life: 5000});
          }
        }));
    } else {
      this._toastService.add({type: 'warning', message: 'Complete todos los campos requeridos!', life: 5000});
      this.formMsg.markAllAsTouched();
    }

  }

}
