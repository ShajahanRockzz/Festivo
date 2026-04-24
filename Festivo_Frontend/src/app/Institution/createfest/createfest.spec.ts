import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createfest } from './createfest';

describe('Createfest', () => {
  let component: Createfest;
  let fixture: ComponentFixture<Createfest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createfest],
    }).compileComponents();

    fixture = TestBed.createComponent(Createfest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
