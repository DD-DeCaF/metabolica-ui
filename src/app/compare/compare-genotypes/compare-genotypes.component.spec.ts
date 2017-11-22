import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareGenotypesComponent } from './compare-genotypes.component';
import {AppModule} from '../../app.module';
import {APP_BASE_HREF} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('CompareGenotypesComponent', () => {
  let component: CompareGenotypesComponent;
  let fixture: ComponentFixture<CompareGenotypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        // SessionService,
        {provide: APP_BASE_HREF, useValue: 'https://iloop.biosustain.dtu.dk/'}
      ],
      imports: [AppModule, FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareGenotypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
