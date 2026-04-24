import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festdetailsguest } from './festdetailsguest';

describe('Festdetailsguest', () => {
  let component: Festdetailsguest;
  let fixture: ComponentFixture<Festdetailsguest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festdetailsguest],
    }).compileComponents();

    fixture = TestBed.createComponent(Festdetailsguest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
