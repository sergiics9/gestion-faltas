import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorFaltaForm } from './profesor-falta-form';

describe('ProfesorFaltaForm', () => {
  let component: ProfesorFaltaForm;
  let fixture: ComponentFixture<ProfesorFaltaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesorFaltaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfesorFaltaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
