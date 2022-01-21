import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {

  processes: any = [];
  activeEmptyMsg =true;

  isBlock = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  public findProcess(evt: any) {

  }

  public selectedProcessItem(evt: any) {
  }

}
