import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyWordEntitiesComponent } from './key-word-entities.component';

describe('KeyWordEntitiesComponent', () => {
  let component: KeyWordEntitiesComponent;
  let fixture: ComponentFixture<KeyWordEntitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyWordEntitiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyWordEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
