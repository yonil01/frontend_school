import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< HEAD:src/app/modules/wizard/process/process/Pages/process-show/process-show.component.spec.ts
import { ProcessShowComponent } from './process-show.component';

describe('ProcessShowComponent', () => {
  let component: ProcessShowComponent;
  let fixture: ComponentFixture<ProcessShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessShowComponent ]
=======
import { BlockOptionComponent } from './block-option.component';

describe('BlockOptionComponent', () => {
  let component: BlockOptionComponent;
  let fixture: ComponentFixture<BlockOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockOptionComponent ]
>>>>>>> ffcf084ba2cf047c3070f7fee737c94f0aa23d00:src/app/modules/wizard/dynamic-forms/container/block-option/block-option.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
<<<<<<< HEAD:src/app/modules/wizard/process/process/Pages/process-show/process-show.component.spec.ts
    fixture = TestBed.createComponent(ProcessShowComponent);
=======
    fixture = TestBed.createComponent(BlockOptionComponent);
>>>>>>> ffcf084ba2cf047c3070f7fee737c94f0aa23d00:src/app/modules/wizard/dynamic-forms/container/block-option/block-option.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
