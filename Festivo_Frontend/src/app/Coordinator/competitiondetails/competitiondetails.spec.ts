import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Competitiondetails } from './competitiondetails';

describe('Competitiondetails', () => {
  let component: Competitiondetails;
  let fixture: ComponentFixture<Competitiondetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Competitiondetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Competitiondetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
