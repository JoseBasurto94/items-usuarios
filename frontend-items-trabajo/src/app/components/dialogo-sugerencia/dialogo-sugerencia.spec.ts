import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSugerencia } from './dialogo-sugerencia';

describe('DialogoSugerencia', () => {
  let component: DialogoSugerencia;
  let fixture: ComponentFixture<DialogoSugerencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoSugerencia],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogoSugerencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
