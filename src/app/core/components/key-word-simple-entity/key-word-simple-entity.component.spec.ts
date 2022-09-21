import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyWordSimpleEntityComponent } from './key-word-simple-entity.component';

describe('KeyWordSimpleEntityComponent', () => {
  let component: KeyWordSimpleEntityComponent;
  let fixture: ComponentFixture<KeyWordSimpleEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyWordSimpleEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyWordSimpleEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
