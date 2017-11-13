import {inject, TestBed} from '@angular/core/testing';

import {SharingService} from './sharing.service';
import {Router} from '@angular/router';
import {RegistryService} from '../registry/registry.service';

describe('SharingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharingService,
        {
          provide: Router,
          useClass: class {navigate = jasmine.createSpy('navigate'); }
        },
        RegistryService
      ]
    });
  });

  it('should be created', inject([SharingService], (service: SharingService) => {
    expect(service).toBeTruthy();
  }));
});
