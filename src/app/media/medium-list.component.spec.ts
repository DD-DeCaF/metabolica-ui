import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumListComponent } from './medium-list.component';

describe('MediumListComponent', () => {
  let component: MediumListComponent;
  let fixture: ComponentFixture<MediumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediumListComponent ]
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
