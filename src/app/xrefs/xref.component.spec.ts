import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XrefComponent } from './xref.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../app.module';

describe('XrefComponent', () => {
  let component: XrefComponent;
  let fixture: ComponentFixture<XrefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
        ],
      imports: [AppModule]
  })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XrefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
