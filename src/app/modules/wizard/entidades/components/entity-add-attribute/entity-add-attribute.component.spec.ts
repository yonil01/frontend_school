import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAddAttributeComponent } from './entity-add-attribute.component';

describe('EntityAddAttributeComponent', () => {
  let component: EntityAddAttributeComponent;
  let fixture: ComponentFixture<EntityAddAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityAddAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAddAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
