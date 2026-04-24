import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festparticipant } from './festparticipant';

describe('Festparticipant', () => {
  let component: Festparticipant;
  let fixture: ComponentFixture<Festparticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festparticipant],
    }).compileComponents();

    fixture = TestBed.createComponent(Festparticipant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
