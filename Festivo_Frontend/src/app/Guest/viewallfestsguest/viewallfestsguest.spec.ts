import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewallfestsguest } from './viewallfestsguest';

describe('Viewallfestsguest', () => {
  let component: Viewallfestsguest;
  let fixture: ComponentFixture<Viewallfestsguest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewallfestsguest],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewallfestsguest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
