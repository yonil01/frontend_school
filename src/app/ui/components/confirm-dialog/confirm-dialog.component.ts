import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {animate, animation, style, transition, trigger, useAnimation} from "@angular/animations";
import {ConfirmDialogService} from "./confirm-dialog.service";
import {Subscription} from "rxjs/internal/Subscription";
import {Confirmation} from "./model";

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
  @Input() show: boolean = false;
  @Input('type') type: string = 'success';
  @Input() title: string = '';
  @Input() body: string = '';
  @Output('onEvent') action: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _subscription: Subscription = new Subscription();

  // animation styles display

  public transformOptions: string = "translate3d(0px, -100%, 0px)"; // top
  // public transformOptions = "translate3d(-100%, 0px, 0px)"; // left
  // public transformOptions = "translate3d(100%, 0px, 0px)"; // right
  // public transformOptions = "translate3d(0px, 100%, 0px)"; // bottom

  // animation styles duration
  public transitionOptions: string = '150ms cubic-bezier(0, 0, 0.2, 1)';


  /*public confirmation: Confirmation;
  public confirmationOptions: Confirmation;*/

  constructor(
    private _confirmDialogService: ConfirmDialogService
  ) {
    // TODO por revisar mañana
    /*this._subscription.add(
      this._confirmDialogService.requireConfirmation$.subscribe(
        (confirmation) => {
          if (!confirmation) {
            this.show = false;
            return;
          }

          if (confirmation.key === this.key) {
            this.confirmation = confirmation;
            this.confirmationOptions = {
              message: this.confirmation.message || this.body,
              icon: this.confirmation.icon || this.icon,
              header: this.confirmation.header || this.header,
              rejectVisible: this.confirmation.rejectVisible == null ? this.rejectVisible : this.confirmation.rejectVisible,
              acceptVisible: this.confirmation.acceptVisible == null ? this.acceptVisible : this.confirmation.acceptVisible,
              acceptLabel: this.confirmation.acceptLabel || this.acceptLabel,
              rejectLabel: this.confirmation.rejectLabel || this.rejectLabel,
              acceptIcon: this.confirmation.acceptIcon || this.acceptIcon,
              rejectIcon: this.confirmation.rejectIcon || this.rejectIcon,
              acceptButtonStyleClass: this.confirmation.acceptButtonStyleClass || this.acceptButtonStyleClass,
              rejectButtonStyleClass: this.confirmation.rejectButtonStyleClass || this.rejectButtonStyleClass,
              defaultFocus: this.confirmation.defaultFocus || this.defaultFocus,
              blockScroll: (this.confirmation.blockScroll === false || this.confirmation.blockScroll === true) ? this.confirmation.blockScroll : this.blockScroll,
              closeOnEscape: (this.confirmation.closeOnEscape === false || this.confirmation.closeOnEscape === true) ? this.confirmation.closeOnEscape : this.closeOnEscape,
              dismissableMask: (this.confirmation.dismissableMask === false || this.confirmation.dismissableMask === true) ? this.confirmation.dismissableMask : this.dismissableMask
            };

            if (this.confirmation.accept) {
              this.confirmation.acceptEvent = new EventEmitter();
              this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
            }

            if (this.confirmation.reject) {
              this.confirmation.rejectEvent = new EventEmitter();
              this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
            }

            this.show = true;
          }
        })
    );*/
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnInit(): void {
  }

  public onAnimationStart(event: any): void {
    // event animation start
  }

  onAnimationEnd(event: any) {
    switch (event.toState) {
      case 'void':
        // event animation end
        break;
    }
  }

}
