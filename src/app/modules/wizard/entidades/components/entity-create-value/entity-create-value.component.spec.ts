import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCreateValueComponent } from './entity-create-value.component';

describe('EntityCreateValueComponent', () => {
  let component: EntityCreateValueComponent;
  let fixture: ComponentFixture<EntityCreateValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityCreateValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCreateValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
