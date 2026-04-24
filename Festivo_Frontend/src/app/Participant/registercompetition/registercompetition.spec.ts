import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registercompetition } from './registercompetition';

describe('Registercompetition', () => {
  let component: Registercompetition;
  let fixture: ComponentFixture<Registercompetition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registercompetition],
    }).compileComponents();

    fixture = TestBed.createComponent(Registercompetition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
