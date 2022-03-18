import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-attribute-security',
  templateUrl: './roles-attribute-security.component.html',
  styleUrls: ['./roles-attribute-security.component.scss']
})
export class RolesAttributeSecurityComponent implements OnInit {

  isEdit:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
