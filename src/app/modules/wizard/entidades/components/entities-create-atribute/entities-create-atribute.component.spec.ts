import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitiesCreateAtributeComponent } from './entities-create-atribute.component';

describe('EntitiesCreateAtributeComponent', () => {
  let component: EntitiesCreateAtributeComponent;
  let fixture: ComponentFixture<EntitiesCreateAtributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntitiesCreateAtributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitiesCreateAtributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
