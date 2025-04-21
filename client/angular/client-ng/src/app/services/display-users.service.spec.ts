import { TestBed } from '@angular/core/testing';

import { DisplayUsersService } from './display-users.service';

describe('DisplayUsersService', () => {
  let service: DisplayUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
