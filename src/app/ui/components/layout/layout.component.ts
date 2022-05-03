import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public openMenu = true;
  public activeSidebar: boolean = false;
  @Input() typeButton: number;
  @Input() styleSidebar: string = '';

  constructor(private location: Location) {
    this.typeButton = 0;
  }

  ngOnInit(): void {
  }

  public changeStatusSidebar(){
    this.activeSidebar = !this.activeSidebar;
  }

  public loadUrl() {
    window.location.reload();
  }

  public backLoad():void {
    this.location.back();
  }
}
