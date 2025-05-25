import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeViewerComponent } from './recipe-viewer.component';

describe('RecipeViewerComponent', () => {
  let component: RecipeViewerComponent;
  let fixture: ComponentFixture<RecipeViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
