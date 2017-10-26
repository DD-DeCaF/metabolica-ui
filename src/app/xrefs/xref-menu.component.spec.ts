import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XrefMenuComponent } from './xref-menu.component';

describe('XrefMenuComponent', () => {
  let component: XrefMenuComponent;
  let fixture: ComponentFixture<XrefMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XrefMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XrefMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
