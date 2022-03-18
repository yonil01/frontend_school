import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-privilege',
  templateUrl: './roles-privilege.component.html',
  styleUrls: ['./roles-privilege.component.scss']
})
export class RolesPrivilegeComponent implements OnInit {

  isActivePrivilege: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
