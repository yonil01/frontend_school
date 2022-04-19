import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() type: string;
  @Input() label = '';
  @Input() icon = '';
  @Input() bgColor = '';
  @Input() txtColor = '';
  @Input() brColor = '';
  @Input() styleLabel = '';
  @Input() btnStyle = '';
  @Input() iconLeft = false;
  @Input() disabled: boolean;

  public backgroundColor: string;
  public textColorBase: string;
  public borderColorBase: string;

  constructor() {
    this.type='';
    this.backgroundColor='';
    this.textColorBase='';
    this.borderColorBase='';
    this.disabled = false;
  }

  public ngOnInit(): void {
    this.setButtonColor();
  }

  private setButtonColor(): void {
    if (this.bgColor === '' && this.txtColor === '' && this.brColor === '') {
      this.backgroundColor = 'bg-container-orange-3';
      this.textColorBase = 'text-white';
      this.borderColorBase = 'border-transparent';
    } else if (this.bgColor === '' && this.brColor === '') {
      this.backgroundColor = 'bg-transparent';
      this.textColorBase = this.txtColor;
      this.borderColorBase = 'border-transparent';
    } else if (this.bgColor === '') {
      this.backgroundColor = 'bg-transparent';
      this.textColorBase = this.txtColor;
      this.borderColorBase = this.brColor;
    } else if (this.brColor === '') {
      this.backgroundColor = this.bgColor;
      this.textColorBase = this.txtColor;
      this.borderColorBase = 'border-transparent';
    } else {
      this.backgroundColor = this.bgColor;
      this.textColorBase = this.txtColor;
      this.borderColorBase = this.brColor;
    }
  }

}
