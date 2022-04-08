import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesCrudComponent } from './messages-crud.component';

describe('MessagesCrudComponent', () => {
  let component: MessagesCrudComponent;
  let fixture: ComponentFixture<MessagesCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
