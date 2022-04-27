import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DocumentsComponent} from "@app/modules/wizard/documents/documents.component";
import {AnnexesDocComponent} from "@app/modules/wizard/documents/components/annexes-doc/annexes-doc.component";

const routes: Routes = [
  {
    path: '', component: DocumentsComponent
  },
  {
    path: 'annexes-doc', component: AnnexesDocComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
