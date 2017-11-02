import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClipboardMenuPanelComponent} from './clipboard-menu-panel.component';

describe('ClipboardMenuPanelComponent', () => {
  let component: ClipboardMenuPanelComponent;
  let fixture: ComponentFixture<ClipboardMenuPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClipboardMenuPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipboardMenuPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
