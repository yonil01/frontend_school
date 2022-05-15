import {Component, OnInit} from '@angular/core';
import {TableModel} from "@app/ui/components/table/model/table.model";
import {
  styleTableConsoleNotifications
} from "@app/modules/administration/modules/console-notify/models/console-notify.models";
import {Timer} from "@app/core/models";
import {ToastService} from "ecapture-ng-ui";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs/internal/Subscription";
import {ToastStyleModel} from "ecapture-ng-ui/lib/modules/toast/model/toast.model";
import {toastDataStyle} from "@app/core/models/toast/toast";
import {ConsoleNotifyService} from "@app/modules/administration/modules/console-notify/services/console-notify.service";
import {ReportService} from "@app/core/services/graphql/report/report.service";

@Component({
  selector: 'app-console-notify',
  templateUrl: './console-notify.component.html',
  styleUrls: ['./console-notify.component.scss']
})
export class ConsoleNotifyComponent implements OnInit {

  public styleTableNotify: TableModel = styleTableConsoleNotifications;
  public toastStyle: ToastStyleModel = toastDataStyle;
  private _subscription: Subscription = new Subscription();
  public isBlockPage: boolean = false;

  constructor(private _messageService: ToastService,
              private datePipe: DatePipe,
              private _consoleNotifyService: ConsoleNotifyService,
              private _reportService: ReportService) {
  }

  ngOnInit(): void {
    this.getNotifications()
  }

  public getNotifications(): void {
    this.isBlockPage = true;
    const procedure = 'public.rpt_get_notificationsConsole'
    this._subscription.add(
      this._reportService.getInfoReport(procedure, {}).subscribe({
        next: (res) => {
          if (res.error) {
            this.isBlockPage = false;
            this._messageService.add({
              type: 'error',
              message: res.msg,
              life: 5000,
            })
          } else {
            if (res.data.length) {
              res.data.forEach((data: any) => {
                const newData: any = {
                  value: data,
                  value1: data.kw,
                  value2: data.kw_values,
                  value3: data.w_priority,
                  value4: data.d_autoname,
                  value5: data.w_type,
                  value6: data.u_username,
                  value7: data.w_status === 1 ? 'Enviado' : 'Pendiente',
                  value8: String(this.datePipe.transform(data.kw_created_at, 'yyyy-MM-dd hh:mm:ss'))
                }
                this.styleTableNotify.dataSource?.push(newData);
              })
            }
          }
          this.isBlockPage = false;
        },
        error: (err: Error) => {
          this.isBlockPage = false;
          this._messageService.add({
            type: 'error',
            message: err.message,
            life: 5000,
          })
        }
      })
    );
  }

}
