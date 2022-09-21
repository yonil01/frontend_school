import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {animate, animation, style, transition, trigger, useAnimation} from "@angular/animations";
import {ConfirmDialogService} from "@app/core/ui/confirm-dialog/confirm-dialog.service";
import {Confirmation} from "@app/core/ui/confirm-dialog/model";

const showAnimation = animation([
  style({transform: '{{transform}}', opacity: 0}),
  animate('{{transition}}', style({transform: 'none', opacity: 1}))
]);

const hideAnimation = animation([
  animate('{{transition}}', style({transform: '{{transform}}', opacity: 0}))
]);

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  animations: [
    trigger('dialogAnimation', [
      transition('void => visible', [
        useAnimation(showAnimation)
      ]),
      transition('visible => void', [
        useAnimation(hideAnimation)
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  @Input() show!: boolean;

  @Input() get visible(): any {
    return this._visible;
  }

  set visible(value: any) {
    this._visible = value;

    this.cd.markForCheck();
  }

  private _visible = false;
  @Input() key: string = '';
  @Input() type: string = 'success';
  @Input() title: string = '';
  @Input() body: string = '';
  @Output('onEvent') action: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('position-display') get position(): any {
    return this._position;
  }

  set position(value: any) {
    this._position = value ? value : 'center';
    switch (value) {
      case 'top':
        this.transformOptions = "translate3d(0px, -100%, 0px)";
        break;
      case 'left':
        this.transformOptions = "translate3d(-100%, 0px, 0px)";
        break;
      case 'right':
        this.transformOptions = "translate3d(100%, 0px, 0px)";
        break;
      case 'bottom':
        this.transformOptions = "translate3d(0px, 100%, 0px)";
        break;
      default:
        this.transformOptions = "scale(0.7)";
        break;
    }
    this.cd.markForCheck();
  }

  private _position: string = 'center';

  public transformOptions: string = "translate3d(0px, -100%, 0px)";

  // animation styles duration
  public transitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';


  public confirmation!: Confirmation;

  constructor(
    private _confirmDialogService: ConfirmDialogService,
    private cd: ChangeDetectorRef
  ) {
    this._confirmDialogService.requireConfirmation$.subscribe(
      (confirmation) => {

        if (!confirmation) {
          this.visible = false;
          return;
        }

        if (confirmation.key === this.key) {
          this.confirmation = confirmation;

          if (this.confirmation.accept) {
            this.confirmation.acceptEvent = new EventEmitter();
            this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
          }

          if (this.confirmation.reject) {
            this.confirmation.rejectEvent = new EventEmitter();
            this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
          }

          this.position = this.confirmation.position;

          this.visible = true;
        }
      })
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  public reject(): void {
    if (this.confirmation && this.confirmation.rejectEvent) {
      this.confirmation.rejectEvent.emit(2);
    }

    this.hideDialog();
  }

  public accept(): void {
    if (this.confirmation && this.confirmation.acceptEvent) {
      this.confirmation.acceptEvent.emit();
    }

    this.hideDialog();
  }

  private hideDialog(): void {
    this.visible = false;
    this.confirmation = {};
  }

  public onAnimationStart(event: any): void {
    // event animation start
  }

  public onAnimationEnd(event: any): void {
    switch (event.toState) {
      case 'void':

        break;
    }
  }

}
