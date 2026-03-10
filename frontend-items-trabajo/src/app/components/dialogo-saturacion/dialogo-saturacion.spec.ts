import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSaturacion } from './dialogo-saturacion';

describe('DialogoSaturacion', () => {
  let component: DialogoSaturacion;
  let fixture: ComponentFixture<DialogoSaturacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoSaturacion],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogoSaturacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
