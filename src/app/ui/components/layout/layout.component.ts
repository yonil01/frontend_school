import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public openMenu = true;
  public activeSidebar: boolean = false;
  @Input() styleSidebar: string = '';

  constructor() {}

  ngOnInit(): void {}

  public changeStatusSidebar(){
    this.activeSidebar = !this.activeSidebar;
  }
}
