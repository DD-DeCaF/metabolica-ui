import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import {Router} from '@angular/router';
import {SessionService} from '../session/session.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutComponent ],
      providers: [{
        provide: Router,
        useClass: class {navigate = jasmine.createSpy('navigate'); }
      },
        SessionService,
        HttpClient,
        HttpHandler,
        LocalStorageService
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
