import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarAsignacion } from './confirmar-asignacion';

describe('ConfirmarAsignacion', () => {
  let component: ConfirmarAsignacion;
  let fixture: ComponentFixture<ConfirmarAsignacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarAsignacion],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarAsignacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
