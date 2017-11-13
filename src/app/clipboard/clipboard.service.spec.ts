import {inject, TestBed} from '@angular/core/testing';

import {ClipboardService} from './clipboard.service';
import {RegistryService} from '../registry/registry.service';

describe('ClipboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClipboardService, RegistryService]
    });
  });

  it('should be created', inject([ClipboardService], (service: ClipboardService) => {
    expect(service).toBeTruthy();
  }));
});
