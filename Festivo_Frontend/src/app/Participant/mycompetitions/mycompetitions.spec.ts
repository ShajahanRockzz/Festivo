import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mycompetitions } from './mycompetitions';

describe('Mycompetitions', () => {
  let component: Mycompetitions;
  let fixture: ComponentFixture<Mycompetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mycompetitions],
    }).compileComponents();

    fixture = TestBed.createComponent(Mycompetitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
