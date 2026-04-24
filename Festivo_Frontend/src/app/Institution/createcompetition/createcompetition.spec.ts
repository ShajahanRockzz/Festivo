import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createcompetition } from './createcompetition';

describe('Createcompetition', () => {
  let component: Createcompetition;
  let fixture: ComponentFixture<Createcompetition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createcompetition],
    }).compileComponents();

    fixture = TestBed.createComponent(Createcompetition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
