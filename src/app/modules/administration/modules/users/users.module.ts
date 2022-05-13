import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {UserListComponent} from './pages/user-list/user-list.component';
import {UserCrudComponent} from './pages/user-crud/user-crud.component';
import {BasicInformationComponent} from './pages/user-crud/components/basic-information/basic-information.component';
import {RoleComponent} from './pages/user-crud/components/role/role.component';
import {SecurityEntitiesComponent} from './pages/user-crud/components/security-entities/security-entities.component';
import {UiModule} from "@app/ui/ui.module";


import {
  DropdownModule, IconsModule,
  InputPasswordModule,
  InputTextModule,
  StepModule,
  ToastModule,
  ToastService,

} from "ecapture-ng-ui";
import {ReactiveFormsModule} from "@angular/forms";

//  primeng module

import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {PanelModule} from 'primeng/panel';
import {PasswordModule} from 'primeng/password';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MenubarModule} from 'primeng/menubar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {KeyFilterModule} from 'primeng/keyfilter';
import {MultiSelectModule} from 'primeng/multiselect';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {CardModule} from 'primeng/card';
import {PickListModule} from 'primeng/picklist';
import {StepsModule} from 'primeng/steps';
import {FileUploadModule} from 'primeng/fileupload';
import {TooltipModule} from 'primeng/tooltip';
import {TranslateModule} from "@ngx-translate/core";
import {
  ChangePasswordComponent
} from "@app/modules/administration/modules/users/pages/change-password/change-password.component";


@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserCrudComponent,
    BasicInformationComponent,
    RoleComponent,
    SecurityEntitiesComponent,
    ChangePasswordComponent
  ],
  exports: [
    UserCrudComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    UiModule,
    StepModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    PickListModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    PanelModule,
    PasswordModule,
    DialogModule,
    ConfirmDialogModule,
    MenubarModule,
    ToastModule,
    RadioButtonModule,
    CheckboxModule,
    KeyFilterModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    CardModule,
    StepsModule,
    FileUploadModule,
    TooltipModule,
    PickListModule,
    InputPasswordModule,
    IconsModule,
    TranslateModule,
  ],
  providers: [ToastService]
})
export class UsersModule {
}
