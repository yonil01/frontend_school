import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[ecTemplate]'
})
export class EcTemplateDirective {

  @Input() type: string = '';

  @Input('ecTemplate') name: string = '';

  constructor(public template: TemplateRef<any>) {
  }

  public getType(): string {
    return this.name;
  }

}
