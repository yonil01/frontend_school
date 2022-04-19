import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParametersComponent} from "@app/modules/administration/modules/parameters/parameters.component";
import { ParameterListComponent } from './pages/parameter-list/parameter-list.component';
import { ParameterCrudComponent } from './pages/parameter-crud/parameter-crud.component';
import {
  ParametersService
} from "@app/modules/administration/modules/parameters/services/parameters.service";
import {ParametersRoutingModule} from "@app/modules/administration/modules/parameters/parameters.routing.module";
import {HttpClientModule} from "@angular/common/http";
import {UiModule} from "@app/ui/ui.module";
import {ToastModule} from "ecapture-ng-ui";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ParametersComponent, ParameterListComponent, ParameterCrudComponent],
    imports: [
        CommonModule,
        ParametersRoutingModule,
        HttpClientModule,
        UiModule,
        ToastModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers:[
    ParametersService
  ]

})
export class ParametersModule { }
