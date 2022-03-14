import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityCreateEditCascadingComponent } from './entity-create-edit-cascading.component';

describe('EntityCreateEditCascadingComponent', () => {
  let component: EntityCreateEditCascadingComponent;
  let fixture: ComponentFixture<EntityCreateEditCascadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityCreateEditCascadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityCreateEditCascadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
