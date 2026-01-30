import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiaPanel } from './guardia-panel';

describe('GuardiaPanel', () => {
  let component: GuardiaPanel;
  let fixture: ComponentFixture<GuardiaPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardiaPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardiaPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
