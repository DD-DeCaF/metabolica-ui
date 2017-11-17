import { TestBed, inject } from '@angular/core/testing';

import { ProjectDeactivationGuardService } from './project-deactivation-guard.service';

describe('ProjectDeactivationGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectDeactivationGuardService]
    });
  });

  it('should be created', inject([ProjectDeactivationGuardService], (service: ProjectDeactivationGuardService) => {
    expect(service).toBeTruthy();
  }));
});
