import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoNoOptimo } from './dialogo-no-optimo';

describe('DialogoNoOptimo', () => {
  let component: DialogoNoOptimo;
  let fixture: ComponentFixture<DialogoNoOptimo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogoNoOptimo],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogoNoOptimo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
