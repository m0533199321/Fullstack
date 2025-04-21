import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayUsersComponent } from './display-users.component';

describe('DisplayUsersComponent', () => {
  let component: DisplayUsersComponent;
  let fixture: ComponentFixture<DisplayUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
