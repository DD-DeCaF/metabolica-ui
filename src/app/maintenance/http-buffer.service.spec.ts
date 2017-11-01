import { TestBed, inject } from '@angular/core/testing';

import { HttpBufferService } from './http-buffer.service';

describe('HttpBufferService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpBufferService]
    });
  });

  it('should be created', inject([HttpBufferService], (service: HttpBufferService) => {
    expect(service).toBeTruthy();
  }));
});
