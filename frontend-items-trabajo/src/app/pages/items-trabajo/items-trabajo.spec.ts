import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsTrabajo } from './items-trabajo';

describe('ItemsTrabajo', () => {
  let component: ItemsTrabajo;
  let fixture: ComponentFixture<ItemsTrabajo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemsTrabajo],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsTrabajo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
