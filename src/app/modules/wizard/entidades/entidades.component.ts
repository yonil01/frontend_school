import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "@app/core/services/local-storage/local-storage.service";

@Component({
  selector: 'app-entidades',
  templateUrl: './entidades.component.html',
  styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {

  processes: any = [];
  activeEmptyMsg = true;

  isBlock = false;

  nameClient: string = '';
  nameProject: string = '';

  constructor(private _localStorage: LocalStorageService) {
    this.nameClient = this._localStorage.getClient();
    this.nameProject = this._localStorage.getProject();
  }

  ngOnInit(): void {
  }

  public findProcess(evt: any) {

  }

  public selectedProcessItem(evt: any) {
  }

}
