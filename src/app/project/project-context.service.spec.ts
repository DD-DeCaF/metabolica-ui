import { TestBed, inject } from '@angular/core/testing';

import { ProjectContextService } from './project-context.service';

describe('ProjectContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectContextService]
    });
  });

  it('should be created', inject([ProjectContextService], (service: ProjectContextService) => {
    expect(service).toBeTruthy();
  }));
});
