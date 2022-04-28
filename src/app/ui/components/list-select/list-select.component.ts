import {Component, Input, OnInit} from '@angular/core';
import {
  ChangeTab, ModelDateHoliday,
  ModelListSelect, ModelListSelectHoliday, ModelWorkingHours,
} from "@app/ui/components/list-select/models/list-select.model";
import {DataDrop, DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";
import {dataWeek, dropStyle} from "@app/ui/components/list-select/models/list-select.constans";
import {NgxMaterialTimepickerTheme} from "ngx-material-timepicker";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss']
})
export class ListSelectComponent implements OnInit {
  @Input() listSelect: ModelListSelect[];
  @Input() listSelectHoliday: ModelListSelectHoliday[];
  public readonly dropStyle: DropdownModel = dropStyle;
  public dataWeek: DataDrop[] = dataWeek;
  public formWorkingHours: FormGroup;
  public formHoliday: FormGroup;
  Object = Object;
  public dataStatus: ChangeTab[] = [
    {
      label: 'Horario',
      status: true,
    },
    {
      label: 'Festivo',
      status: false,
    },
  ]

  constructor(private _formBuilder: FormBuilder,  private datePipe: DatePipe) {
    this.formWorkingHours = this._formBuilder.group({
      start_day: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_day: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
    });

    this.formHoliday = this._formBuilder.group({
      name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
    });
    this.listSelect = [
      {
        status: false,
        value: {
          start_day: 'Fecha Inicio',
          start_time: 'Hora Inicio',
          end_day: 'Fecha Final',
          end_time: 'Hora Final'
        }
      },
      {
        status: false,
        value: {
          start_day: 'time_start',
          start_time: 'time_start',
          end_day: 'end_date',
          end_time: 'end_time'
        }
      }
    ];

    this.listSelectHoliday = [
      {
        status: false,
        value: {
          name: 'Nombre',
          start_date: 'Fecha Inicio',
          start_time: 'Hora Inicio',
          end_date: 'Fecha Final',
          end_time: 'Hora Final'
        }
      },
      {
        status: false,
        value: {
          name: 'Nombre',
          start_date: 'Fecha Inicio',
          start_time: 'Hora Inicio',
          end_date: 'Fecha Final',
          end_time: 'Hora Final'
        }
      },
      {
        status: false,
        value: {
          name: 'Nombre',
          start_date: 'Fecha Inicio',
          start_time: 'Hora Inicio',
          end_date: 'Fecha Final',
          end_time: 'Hora Final'
        }
      },
    ];
  }

  ngOnInit(): void {

  }

  public changeStatusTab(index: number): void {
    this.dataStatus.forEach((item: ChangeTab, i: number)=>{
      if (index===i)item.status=true
      else item.status=false
    })
  }

  public changeStatusSelect(index: number): void {
    if (index)this.listSelect[index].status = !this.listSelect[index].status;
  }

  public changeStatusSelectHoliday(index: number): void {
    if (index)this.listSelectHoliday[index].status = !this.listSelectHoliday[index].status;
  }

  public addWorkingHours(): void {
    if (this.formWorkingHours.valid) {
      const newWorkingHours: ModelWorkingHours = {
        start_day: this.formWorkingHours.get('start_day')?.value,
        start_time: this.formWorkingHours.get('start_time')?.value,
        end_day: this.formWorkingHours.get('end_day')?.value,
        end_time: this.formWorkingHours.get('end_time')?.value,
      }
      this.listSelect.push({value: newWorkingHours, status: false});
    }
  }

  public deleteWorkingHours(): void {
    this.listSelect.filter(data => data.status).forEach(x => this.listSelect.splice(this.listSelect.indexOf(x), 1));
  }

  public addFormHoliday(): void {
    if (this.formHoliday.valid) {
      const newWorkingHours: ModelDateHoliday = {
        name: this.formHoliday.get('name')?.value,
        start_date: String(this.datePipe.transform(this.formHoliday.get('start_date')?.value, 'yyyy-MM-dd')),
        start_time: this.formHoliday.get('start_time')?.value,
        end_date: String(this.datePipe.transform(this.formHoliday.get('end_date')?.value, 'yyyy-MM-dd')),
        end_time: this.formHoliday.get('end_time')?.value,
      }
      this.listSelectHoliday.push({value: newWorkingHours, status: false});
    }
  }

  public deleteHoliday(): void {
    this.listSelectHoliday.filter(data => data.status).forEach(x => this.listSelectHoliday.splice(this.listSelectHoliday.indexOf(x), 1));
  }

}
