import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardiaHorario } from './guardia-horario';

describe('GuardiaHorario', () => {
  let component: GuardiaHorario;
  let fixture: ComponentFixture<GuardiaHorario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardiaHorario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardiaHorario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
