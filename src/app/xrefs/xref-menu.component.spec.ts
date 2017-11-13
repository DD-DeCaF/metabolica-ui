import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XrefMenuComponent } from './xref-menu.component';
import {OVERLAY_PROVIDERS, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {SCROLL_DISPATCHER_PROVIDER} from '@angular/cdk//scrolling';
import {Platform} from '@angular/cdk/platform';
import {RegistryService} from '../registry/registry.service';

describe('XrefMenuComponent', () => {
  let component: XrefMenuComponent;
  let fixture: ComponentFixture<XrefMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XrefMenuComponent ],
      providers: [
        OVERLAY_PROVIDERS,
        SCROLL_DISPATCHER_PROVIDER,
        ScrollStrategyOptions,
        Platform,
        {
          provide: RegistryService,
          useClass: class {get(str) {}}
        }
      ]
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
