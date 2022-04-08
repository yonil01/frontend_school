import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StepsCreateProcess} from "@app/core/models/wizard/wizard";
import {dataStepProcess} from "@app/core/utils/constants/constant";
import {ProcessService} from "@app/modules/wizard/services/process/process.service";
import {Process} from "@app/core/models";

@Component({
  selector: 'app-process-create',
  templateUrl: './process-create.component.html',
  styleUrls: ['./process-create.component.scss']
})
export class ProcessCreateComponent implements OnInit, OnDestroy {

  constructor(
    private _fb: FormBuilder,
    private _processService: ProcessService,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }


}
