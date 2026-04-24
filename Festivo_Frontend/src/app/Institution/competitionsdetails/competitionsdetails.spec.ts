import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Competitionsdetails } from './competitionsdetails';

describe('Competitionsdetails', () => {
  let component: Competitionsdetails;
  let fixture: ComponentFixture<Competitionsdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Competitionsdetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Competitionsdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
