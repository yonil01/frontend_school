import {Component, Input, OnInit} from '@angular/core';
import {StepModel} from "@app/ui/components/step/models/step-vertical-model";
import {StyleStepVertical} from "@app/ui/components/step/models/step-vertical-consts";

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {
  @Input() StyleStep: StepModel = StyleStepVertical;
  constructor() { }

  ngOnInit(): void {
  }

  public  changeUbication(index: number) {
    this.StyleStep.dataSourceStep.forEach((item: any, i: number) => {
      debugger
      if (index === i) {
        item.status ='Active'
      } else {
        if (item.status === 'Active' && item.status !== 'Completed') {
          item.status = 'Pending'
        }
      }
    })
  }

}
