import { TestBed } from '@angular/core/testing';

import { AllRecipesService } from './all-recipes.service';

describe('AllRecipesService', () => {
  let service: AllRecipesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllRecipesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
