import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiaAsignacion } from './guardia-asignacion';

describe('GuardiaAsignacion', () => {
  let component: GuardiaAsignacion;
  let fixture: ComponentFixture<GuardiaAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardiaAsignacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardiaAsignacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
