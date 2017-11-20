import { TestBed, inject } from '@angular/core/testing';

import { ProjectDeactivationGuardService } from './project-deactivation-guard.service';
import {ProjectContextService} from './project-context.service';

describe('ProjectDeactivationGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectDeactivationGuardService, ProjectContextService]
    });
  });

  it('should be created', inject([ProjectDeactivationGuardService], (service: ProjectDeactivationGuardService) => {
    expect(service).toBeTruthy();
  }));
});
