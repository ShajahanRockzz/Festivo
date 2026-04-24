import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registrationdetails } from './registrationdetails';

describe('Registrationdetails', () => {
  let component: Registrationdetails;
  let fixture: ComponentFixture<Registrationdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registrationdetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Registrationdetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
