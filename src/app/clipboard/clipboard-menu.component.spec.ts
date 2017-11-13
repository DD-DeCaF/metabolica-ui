import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClipboardMenuComponent} from './clipboard-menu.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../app.module';

describe('ClipboardMenuComponent', () => {
  let component: ClipboardMenuComponent;
  let fixture: ComponentFixture<ClipboardMenuComponent>;

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
    fixture = TestBed.createComponent(ClipboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
