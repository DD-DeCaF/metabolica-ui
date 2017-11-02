import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClipboardMenuComponent} from './clipboard-menu.component';

describe('ClipboardMenuComponent', () => {
  let component: ClipboardMenuComponent;
  let fixture: ComponentFixture<ClipboardMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClipboardMenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipboardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
