import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessShowComponent } from './process-show.component';

describe('ProcessShowComponent', () => {
  let component: ProcessShowComponent;
  let fixture: ComponentFixture<ProcessShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessShowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
