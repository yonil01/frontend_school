import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[appTemplate]'
})
export class EcTemplateDirective {

  @Input() type: string = '';

  @Input('appTemplate') name: string = '';

  constructor(public template: TemplateRef<any>) {}

  public getType(): string {
    return this.name;
  }

}
