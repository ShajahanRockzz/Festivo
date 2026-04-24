import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Studentparticipationreport } from './studentparticipationreport';

describe('Studentparticipationreport', () => {
  let component: Studentparticipationreport;
  let fixture: ComponentFixture<Studentparticipationreport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Studentparticipationreport],
    }).compileComponents();

    fixture = TestBed.createComponent(Studentparticipationreport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
