import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserCrudComponent } from './pages/user-crud/user-crud.component';
import { BasicInformationComponent } from './pages/user-crud/components/basic-information/basic-information.component';
import { RoleComponent } from './pages/user-crud/components/role/role.component';
import { SecurityEntitiesComponent } from './pages/user-crud/components/security-entities/security-entities.component';
import {UiModule} from "@app/ui/ui.module";
import {DropdownModule, InputTextModule, StepModule} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";
import {PickListModule} from 'primeng/picklist';

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserCrudComponent,
    BasicInformationComponent,
    RoleComponent,
    SecurityEntitiesComponent
  ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        UiModule,
        StepModule,
        InputTextModule,
        DropdownModule,
        ReactiveFormsModule,
    ]
})
export class UsersModule { }
