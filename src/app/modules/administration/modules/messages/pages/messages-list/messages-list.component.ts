import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastService} from "ecapture-ng-ui";
import {MsgModel} from "@app/modules/administration/modules/messages/models/msg.model";

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public messages: MsgModel[] = [];

  constructor(
    private _messageService: MessageServices,
    private _toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getAllMsg();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getAllMsg(): void {
    this._subscription.add(
      this._messageService.getAllMsgsService().subscribe(
        {
          next: (res) => {
            if (res.error) {
              this._toastService.add({type: 'error', message: res.msg, life: 5000});
            } else {
              if (res.data) {
                this.messages = res.data;
                console.log(this.messages);
              } else {
                this._toastService.add({type: 'info', message: 'No hay mensajes creados', life: 5000});
              }
            }
          },
          error: (err: Error) => {
            console.error(err.message);
            this._toastService.add({type: 'error', message: 'No se pudo obtener la información solicitada, Contactese con el administrador de servicio!', life: 5000});
          }
        }
      )
    );
  }

  public deleteMsg(id: string): void {
    this._subscription.add(
      this._messageService.deleateMsgService(id).subscribe({
        next: (res) => {
          if (res.error) {
            this._toastService.add({type: 'error', message: res.msg, life: 5000});
          } else {
            this._toastService.add({type: 'success', message: 'Mensage eliminado correctamente!', life: 500});
            this.messages = this.messages.filter(msg => msg.id.toString() !== id);
          }
        },
        error: (err: Error) => {
          console.error(err.message);
          this._toastService.add({type: 'error', message: 'No se pudo obtener la información solicitada, Contactese con el administrador de servicio!', life: 5000});
        }
      })
    );
  }
}
