import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageVisorComponent } from './image-visor.component';

describe('ImageVisorComponent', () => {
  let component: ImageVisorComponent;
  let fixture: ComponentFixture<ImageVisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageVisorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageVisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
