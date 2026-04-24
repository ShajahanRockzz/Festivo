import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festdetailsparticipant } from './festdetailsparticipant';

describe('Festdetailsparticipant', () => {
  let component: Festdetailsparticipant;
  let fixture: ComponentFixture<Festdetailsparticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festdetailsparticipant],
    }).compileComponents();

    fixture = TestBed.createComponent(Festdetailsparticipant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
