import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumComponent } from './medium.component';
import {APP_BASE_HREF} from '@angular/common';
import {AppModule} from '../app.module';

describe('MediumComponent', () => {
  let component: MediumComponent;
  let fixture: ComponentFixture<MediumComponent>;

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
    fixture = TestBed.createComponent(MediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
