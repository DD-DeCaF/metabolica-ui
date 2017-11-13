import { TestBed, inject } from '@angular/core/testing';

import { HttpBufferService } from './http-buffer.service';
import {HttpClient} from '@angular/common/http';
import {AppModule} from '../app.module';
import {APP_BASE_HREF} from '@angular/common';

describe('HttpBufferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpBufferService,
        HttpClient,
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
      ],
      imports: [AppModule]
    });
  });

  it('should be created', inject([HttpBufferService], (service: HttpBufferService) => {
    expect(service).toBeTruthy();
  }));
});
