import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClipboardMenuPanelComponent} from './clipboard-menu-panel.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../app.module';

describe('ClipboardMenuPanelComponent', () => {
  let component: ClipboardMenuPanelComponent;
  let fixture: ComponentFixture<ClipboardMenuPanelComponent>;

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
    fixture = TestBed.createComponent(ClipboardMenuPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
