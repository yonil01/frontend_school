import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideTaskComponent } from './side-task.component';

describe('SideTaskComponent', () => {
  let component: SideTaskComponent;
  let fixture: ComponentFixture<SideTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
