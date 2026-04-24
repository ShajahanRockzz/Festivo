import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewfestcompetitions } from './viewfestcompetitions';

describe('Viewfestcompetitions', () => {
  let component: Viewfestcompetitions;
  let fixture: ComponentFixture<Viewfestcompetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewfestcompetitions],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewfestcompetitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
