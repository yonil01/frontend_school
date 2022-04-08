import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageServices} from "@app/modules/administration/services/message/message.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastService} from "ecapture-ng-ui";
import {MsgModel} from "@app/modules/administration/modules/messages/models/msg.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss']
})
export class MessagesListComponent implements OnInit, OnDestroy {

  private _subscription: Subscription = new Subscription();
  public messages: MsgModel[] = [];
  public onShowEditMessages: boolean = false;
  public onShowMessagesList: boolean = true;
  public selectedMessage!: MsgModel;
  public messageForm: FormGroup;
  public createOrEdit: boolean= false;
  public idMessages: number=0;
  public isShowBlockPage: boolean = false;
  constructor(
    private _messageService: MessageServices,
    private _toastService: ToastService,
    private _fb: FormBuilder
  ) {
    this.messageForm=_fb.group({
      eng: ["",[Validators.required,Validators.maxLength(50),Validators.minLength(4)]],
      spa: ["",[Validators.required,Validators.maxLength(50),Validators.minLength(4)]],
      type_message: ["",[Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllMsg();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  private getAllMsg(): void {
    this.isShowBlockPage=true
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
            this.isShowBlockPage=false
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

  editMessage(): void {
    if (this.messageForm.valid) {
      const msg={
        id:this.idMessages,
        ...this.messageForm.value
      }
      this._subscription.add(
        this._messageService.updateMsgService(msg).subscribe({
          next:(res)=>{
            if (res.error){

            }
            else {
              console.log(res)
              this.createOrEdit=false;
              this.idMessages=0;
            }
          },
          error:(err)=>{
            console.log(err)
          }
        })
      )
    } else {

    }
  }

  createMessage() {

  }

  public editMsj(id: number): void {
    this.idMessages=id;
    this.createOrEdit=true;
    const msgEdit = this.messages.find((msg) => msg.id === id);
    console.log(msgEdit)
    if (msgEdit) {
      this.messageForm.patchValue(
        {
          eng: msgEdit.eng,
          spa: msgEdit.spa,
          type_message: msgEdit.type_message,
        }
      );
    }
  }
}
