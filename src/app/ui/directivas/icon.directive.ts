import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {iconBroadActivityFeed} from "@app/ui/icons/broad-activity-feed/icon";



@Directive({
  selector: '[appIcon]'
})
export class IconDirective implements OnInit {

  @Input() iconName: string;
  @Input() iconColor: string;

  constructor(private elementRef: ElementRef) {
    this.iconName='';
    this.iconColor= '';
  }

  ngOnInit(): void {
    const icon = this.iconName.split(' ');
    this.elementRef.nativeElement.innerHTML = this.findIcon(icon[0], icon[1]);
  }

  // TODO REFACTOR METHOD FIND ICON

  private findIcon(iconName: string, iconPosition: string): string {
    debugger
    if (iconName === 'broad-activity-feed') {
      return this.findIconBroadActivityFeed(iconPosition, this.iconColor);
    }
      return '';
  }

  // TODO change path method find on


  public findIconBroadActivityFeed(iconPosition: string, iconColor: string): string {
    if (iconPosition === 'table') {
      return iconBroadActivityFeed.replace('$2', iconColor);
    }
    return '';
  }

}
