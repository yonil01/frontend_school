import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityEditAtributeComponent } from './entity-edit-atribute.component';

describe('EntityEditAtributeComponent', () => {
  let component: EntityEditAtributeComponent;
  let fixture: ComponentFixture<EntityEditAtributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityEditAtributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityEditAtributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
