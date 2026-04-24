import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewfest } from './viewfest';

describe('Viewfest', () => {
  let component: Viewfest;
  let fixture: ComponentFixture<Viewfest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewfest],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewfest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
