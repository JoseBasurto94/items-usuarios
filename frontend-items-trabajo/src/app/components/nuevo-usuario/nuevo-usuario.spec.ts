import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoUsuario } from './nuevo-usuario';

describe('NuevoUsuario', () => {
  let component: NuevoUsuario;
  let fixture: ComponentFixture<NuevoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
