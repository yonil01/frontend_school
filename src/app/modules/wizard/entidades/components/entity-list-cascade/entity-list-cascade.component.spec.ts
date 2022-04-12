import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListCascadeComponent } from './entity-list-cascade.component';

describe('EntityListCascadeComponent', () => {
  let component: EntityListCascadeComponent;
  let fixture: ComponentFixture<EntityListCascadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityListCascadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListCascadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
