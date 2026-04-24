import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewcompetitions } from './viewcompetitions';

describe('Viewcompetitions', () => {
  let component: Viewcompetitions;
  let fixture: ComponentFixture<Viewcompetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewcompetitions],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewcompetitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
