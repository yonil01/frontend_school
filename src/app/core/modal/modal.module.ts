import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from '@app/core/modal/auth/auth-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthModalComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AuthModalComponent],
})
export class ModalModule {}
