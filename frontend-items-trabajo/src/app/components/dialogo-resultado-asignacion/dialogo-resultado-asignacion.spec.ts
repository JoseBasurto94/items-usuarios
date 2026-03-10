import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoResultadoAsignacion } from './dialogo-resultado-asignacion';

describe('DialogoResultadoAsignacion', () => {
  let component: DialogoResultadoAsignacion;
  let fixture: ComponentFixture<DialogoResultadoAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoResultadoAsignacion],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogoResultadoAsignacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
