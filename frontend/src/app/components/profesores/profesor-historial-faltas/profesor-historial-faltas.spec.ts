import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorHistorialFaltas } from './profesor-historial-faltas';

describe('ProfesorHistorialFaltas', () => {
  let component: ProfesorHistorialFaltas;
  let fixture: ComponentFixture<ProfesorHistorialFaltas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorHistorialFaltas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesorHistorialFaltas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
