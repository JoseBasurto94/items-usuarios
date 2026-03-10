import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarAsignacionAutomatica } from './confirmar-asignacion-automatica';

describe('ConfirmarAsignacionAutomatica', () => {
  let component: ConfirmarAsignacionAutomatica;
  let fixture: ComponentFixture<ConfirmarAsignacionAutomatica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarAsignacionAutomatica],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarAsignacionAutomatica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
