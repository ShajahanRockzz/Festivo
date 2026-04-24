import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registerparticipant } from './registerparticipant';

describe('Registerparticipant', () => {
  let component: Registerparticipant;
  let fixture: ComponentFixture<Registerparticipant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registerparticipant],
    }).compileComponents();

    fixture = TestBed.createComponent(Registerparticipant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
