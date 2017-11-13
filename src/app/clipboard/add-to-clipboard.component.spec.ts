import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddToClipboardComponent} from './add-to-clipboard.component';
import {AppModule} from '../app.module';
import {APP_BASE_HREF} from '@angular/common';

describe('AddToClipboardComponent', () => {
  let component: AddToClipboardComponent;
  let fixture: ComponentFixture<AddToClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        // SessionService,
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
        ],
      imports: [AppModule]
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
