import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityEntitiesComponent } from './security-entities.component';

describe('SecurityEntitiesComponent', () => {
  let component: SecurityEntitiesComponent;
  let fixture: ComponentFixture<SecurityEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
