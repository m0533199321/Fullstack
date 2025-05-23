import { TestBed } from '@angular/core/testing';

import { UserRecipesService } from './user-recipes.service';

describe('UserRecipesService', () => {
  let service: UserRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
