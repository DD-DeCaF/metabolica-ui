import { TestBed, inject } from '@angular/core/testing';

import { ProjectResolverService } from './project-resolver.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {Router} from '@angular/router';

describe('ProjectResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectResolverService,
        HttpClient,
        HttpHandler,
        {
          provide: Router,
          useClass: class {navigate = jasmine.createSpy('navigate'); }
        }
      ]
    });
  });

  it('should be created', inject([ProjectResolverService], (service: ProjectResolverService) => {
    expect(service).toBeTruthy();
  }));
});
