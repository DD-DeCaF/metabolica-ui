import { TestBed, inject } from '@angular/core/testing';

import { HttpInterceptorService } from './http-interceptor.service';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../app.module';

describe('HttpInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpInterceptorService,
        // SessionService,
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
      ],
      imports: [AppModule]
    });
  });

  it('should be created', inject([HttpInterceptorService], (service: HttpInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
