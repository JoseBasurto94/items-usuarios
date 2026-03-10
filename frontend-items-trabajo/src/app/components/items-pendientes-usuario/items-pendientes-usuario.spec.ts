import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsPendientesUsuario } from './items-pendientes-usuario';

describe('ItemsPendientesUsuario', () => {
  let component: ItemsPendientesUsuario;
  let fixture: ComponentFixture<ItemsPendientesUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsPendientesUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsPendientesUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
