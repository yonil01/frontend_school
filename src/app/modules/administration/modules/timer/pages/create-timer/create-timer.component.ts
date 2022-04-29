import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Timer} from "@app/core/models";
import {v4 as uuidv4} from 'uuid';
import {Subscription} from "rxjs/internal/Subscription";
import {TimerService} from "@app/modules/administration/services/timer/timer.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-create-timer',
  templateUrl: './create-timer.component.html',
  styleUrls: ['./create-timer.component.scss']
})
export class CreateTimerComponent implements OnInit {
  @Output() showToast = new EventEmitter<any>();
  @Output() isShowCreate = new EventEmitter<boolean>();
  @Input() timer: Timer = {};
  public Object = Object;

  public formTimer: FormGroup;
  public isBlockPage: boolean = false;

  private _subscription: Subscription = new Subscription();
  constructor(
    private _formBuilder: FormBuilder,
    private _timerService: TimerService,
    private datePipe: DatePipe
    ) {
    this.formTimer = this._formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      day_of_week: ['', [Validators.required]],
      day_of_month: ['', [Validators.required]],
      begin_at: ['', [Validators.required]],
      end_at: ['', [Validators.required]],
      cron: ['', []],
    })
  }

  ngOnInit(): void {
    if (Object.keys(this.timer).length) {
      this.loadTimer();
    }
  }

  public loadTimer() {
    this.formTimer.get('name')?.setValue(this.timer.name);
    this.formTimer.get('type')?.setValue(this.timer.type);
    this.formTimer.get('frequency')?.setValue(this.timer.frequency);
    this.formTimer.get('day_of_week')?.setValue(this.timer.day_of_week);
    this.formTimer.get('day_of_month')?.setValue(this.timer.day_of_month);
    this.formTimer.get('begin_at')?.setValue(this.timer.begin_at);
    this.formTimer.get('end_at')?.setValue(this.timer.end_at);
  }

  public saveForm(): void {
    if (this.formTimer.valid) {
      this.isBlockPage = true;
      debugger
      const newTimer: Timer = {
        id: Object.keys(this.timer).length ? this.timer.id : uuidv4().toLowerCase(),
        name: this.formTimer.get('name')?.value,
        type: this.formTimer.get('type')?.value,
        frequency: Number(this.formTimer.get('frequency')?.value),
        day_of_week: this.formTimer.get('day_of_week')?.value,
        day_of_month: this.formTimer.get('day_of_month')?.value,
        begin_at: this.formTimer.get('begin_at')?.value,
        end_at: this.formTimer.get('end_at')?.value,
        enabled: false,
        is_not_running: false,
        last_execution: new Date(),
        cron: this.formTimer.get('cron')?.value,
      }
      if (Object.keys(this.timer).length) {
        this._subscription.add(
          this._timerService.updateTimer(newTimer).subscribe({
            next: (res) => {
              if (res.error) {
                this.isBlockPage = false;
                this.addToast({
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              } else {
                this.isBlockPage = false;
                this.addToast({
                  type: 'success',
                  message: res.msg,
                  life: 5000,
                });
                this.formTimer.reset();
                this.isShowCreate.emit(false);
              }
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              this.addToast({
                type: 'error',
                message: err,
                life: 5000,
              })
            }
          })
        );
      } else {
        this._subscription.add(
          this._timerService.createTimer(newTimer).subscribe({
            next: (res) => {
              if (res.error) {
                this.isBlockPage = false;
                this.addToast({
                  type: 'error',
                  message: res.msg,
                  life: 5000,
                })
                this.isBlockPage = false;
              } else {
                this.isBlockPage = false;
                this.addToast({
                  type: 'success',
                  message: res.msg,
                  life: 5000,
                });
                this.formTimer.reset();
                this.isShowCreate.emit(false);
              }
            },
            error: (err: Error) => {
              this.isBlockPage = false;
              this.addToast({
                type: 'error',
                message: err,
                life: 5000,
              })
            }
          })
        );
      }
    }
  }

  public addToast(data: any): void {
    this.showToast.emit({type: data.type, message: data.message, life: data.life});
  }
}
