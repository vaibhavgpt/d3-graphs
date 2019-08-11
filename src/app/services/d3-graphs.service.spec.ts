import { TestBed } from '@angular/core/testing';

import { D3GraphsService } from './d3-graphs.service';

describe('D3GraphsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: D3GraphsService = TestBed.get(D3GraphsService);
    expect(service).toBeTruthy();
  });
});
