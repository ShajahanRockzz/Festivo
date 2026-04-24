import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coordinatorhome } from './coordinatorhome';

describe('Coordinatorhome', () => {
  let component: Coordinatorhome;
  let fixture: ComponentFixture<Coordinatorhome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coordinatorhome],
    }).compileComponents();

    fixture = TestBed.createComponent(Coordinatorhome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
