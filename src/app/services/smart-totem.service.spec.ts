import { TestBed } from '@angular/core/testing';

import { SmartTotemService } from './smart-totem.service';

describe('SmartTotemService', () => {
  let service: SmartTotemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartTotemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
