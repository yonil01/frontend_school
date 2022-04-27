import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexesDocComponent } from './annexes-doc.component';

describe('AnnexesDocComponent', () => {
  let component: AnnexesDocComponent;
  let fixture: ComponentFixture<AnnexesDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnexesDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexesDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
