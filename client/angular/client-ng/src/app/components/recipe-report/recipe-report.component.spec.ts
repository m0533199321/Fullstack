import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeReportComponent } from './recipe-report.component';

describe('RecipeReportComponent', () => {
  let component: RecipeReportComponent;
  let fixture: ComponentFixture<RecipeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
