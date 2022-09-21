import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PersonalsRoutingModule} from './personals-routing.module';
import {PersonalsComponent} from './personals.component';
import {SecurityEntitiesComponent} from './pages/personal-crud/components/security-entities/security-entities.component';
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
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {
  PersonalListComponent
} from "@app/modules/administration/modules/personals/pages/personal-list/personal-list.component";
import {
  BasicInformationComponent
} from "@app/modules/administration/modules/personals/pages/personal-crud/components/basic-information/basic-information.component";
import {
  RoleComponent
} from "@app/modules/administration/modules/personals/pages/personal-crud/components/role/role.component";
import {
  ChangePasswordComponent
} from "@app/modules/administration/modules/personals/pages/change-password/change-password.component";
import {
  PersonalCrudComponent
} from "@app/modules/administration/modules/personals/pages/personal-crud/personal-crud.component";


@NgModule({
  declarations: [
    PersonalsComponent,
    PersonalListComponent,
    BasicInformationComponent,
    RoleComponent,
    SecurityEntitiesComponent,
    ChangePasswordComponent,
    PersonalCrudComponent
  ],
  exports: [
    PersonalCrudComponent
  ],
  imports: [
    CommonModule,
    PersonalsRoutingModule,
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
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  providers: [ToastService]
})
export class PersonalsModule {
}
