import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Participantmaster } from './participantmaster';

describe('Participantmaster', () => {
  let component: Participantmaster;
  let fixture: ComponentFixture<Participantmaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Participantmaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Participantmaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
