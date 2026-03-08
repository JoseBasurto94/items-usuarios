import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkitemDialog } from './workitem-dialog';

describe('WorkitemDialog', () => {
  let component: WorkitemDialog;
  let fixture: ComponentFixture<WorkitemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkitemDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkitemDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
