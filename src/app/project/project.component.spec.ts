import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponent } from './project.component';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProjectContextService} from './project-context.service';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectComponent ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: Observable.of({id: 2}),
          snapshot: {data: {project: {}}}
        }
      },
      ProjectContextService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
