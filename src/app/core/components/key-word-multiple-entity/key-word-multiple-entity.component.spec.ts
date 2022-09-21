import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyWordMultipleEntityComponent } from './key-word-multiple-entity.component';

describe('KeyWordMultipleEntityComponent', () => {
  let component: KeyWordMultipleEntityComponent;
  let fixture: ComponentFixture<KeyWordMultipleEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyWordMultipleEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyWordMultipleEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
