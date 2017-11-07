import { TestBed, inject } from '@angular/core/testing';

import { ProjectResolverService } from './project-resolver.service';

describe('ProjectResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectResolverService]
    });
  });

  it('should be created', inject([ProjectResolverService], (service: ProjectResolverService) => {
    expect(service).toBeTruthy();
  }));
});
