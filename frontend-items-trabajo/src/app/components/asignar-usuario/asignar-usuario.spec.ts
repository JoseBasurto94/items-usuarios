import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarUsuario } from './asignar-usuario';

describe('AsignarUsuario', () => {
  let component: AsignarUsuario;
  let fixture: ComponentFixture<AsignarUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignarUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
