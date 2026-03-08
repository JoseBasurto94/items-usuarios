import { TestBed } from '@angular/core/testing';

import { Workitem } from './workitem';

describe('Workitem', () => {
  let service: Workitem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workitem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
