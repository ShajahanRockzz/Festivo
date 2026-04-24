import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festdetails } from './festdetails';

describe('Festdetails', () => {
  let component: Festdetails;
  let fixture: ComponentFixture<Festdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festdetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Festdetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
