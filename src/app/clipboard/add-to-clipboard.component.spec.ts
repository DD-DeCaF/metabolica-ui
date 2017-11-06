import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddToClipboardComponent} from './add-to-clipboard.component';

describe('AddToClipboardComponent', () => {
  let component: AddToClipboardComponent;
  let fixture: ComponentFixture<AddToClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddToClipboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToClipboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
