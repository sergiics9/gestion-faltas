import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFaltas } from './admin-faltas';

describe('AdminFaltas', () => {
  let component: AdminFaltas;
  let fixture: ComponentFixture<AdminFaltas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFaltas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFaltas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
