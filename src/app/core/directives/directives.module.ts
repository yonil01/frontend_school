import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from './drag-drop/drag-drop.directive';

@NgModule({
  declarations: [DragDropDirective],
  imports: [CommonModule],
  exports: [DragDropDirective],
})
export class DirectivesModule {}
