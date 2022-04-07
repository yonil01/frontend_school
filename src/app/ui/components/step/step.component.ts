import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DataStep, StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {StyleStepVertical} from "@app/ui/components/step/models/step-vertical-consts";
import {publish} from "rxjs/operators";

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit, OnChanges {
  @Input() StyleStep: StepModel = StyleStepVertical;
  public porcentaje: number;
  public title: string;
  constructor() {
    this.porcentaje = 0;
    this.title = 'Vacio';
  }
  ngOnInit(): void {

  }

  ngOnChanges(changes: any) {
  }

  public  changeUbication(index: number) {
    const item = this.StyleStep.dataSourceStep[index];
    if (!item.block) {
      this.StyleStep.dataSourceStep.forEach((item: any, i: number) => {
        if (index === i) {
          item.focus = true;
        } else {
          item.focus = false;
        }
      })
    }
  }

}
