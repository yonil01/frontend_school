import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {animate, animation, style, transition, trigger, useAnimation} from "@angular/animations";

const showAnimation = animation([
  style({transform: '{{transform}}'}),
  animate('{{transition}}')
]);

const hideAnimation = animation([
  animate('{{transition}}', style({transform: '{{transform}}'}))
]);

@Component({
  selector: 'app-side-task',
  templateUrl: './side-task.component.html',
  styleUrls: ['./side-task.component.scss'],
  animations: [
    trigger('overlayState', [
        transition('void => visible', [
          useAnimation(showAnimation),
        ]),
        transition('visible => void', [
          useAnimation(hideAnimation)
        ])
      ]
    ),
  ]
})
export class SideTaskComponent implements OnInit {

  @Input('tile-side') title: string = '';


  @Output('on-close') close: EventEmitter<boolean> = new EventEmitter<boolean>();
  public transformOptions: string = "translate3d(100%, 0px, 0px)";
  public transitionOptions: string = '0.2s cubic-bezier(0, 0, 0.2, 1)';

  constructor() { }

  ngOnInit(): void {
  }

}
