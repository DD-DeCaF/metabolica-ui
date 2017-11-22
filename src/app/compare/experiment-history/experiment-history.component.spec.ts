import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentHistoryComponent } from './experiment-history.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../../app.module';

describe('ExperimentHistoryComponent', () => {
  let component: ExperimentHistoryComponent;
  let fixture: ComponentFixture<ExperimentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        // SessionService,
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
      ],
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
