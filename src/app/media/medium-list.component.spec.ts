import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumListComponent } from './medium-list.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../app.module';

describe('MediumListComponent', () => {
  let component: MediumListComponent;
  let fixture: ComponentFixture<MediumListComponent>;

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
    fixture = TestBed.createComponent(MediumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
