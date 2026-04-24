import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buyplan } from './buyplan';

describe('Buyplan', () => {
  let component: Buyplan;
  let fixture: ComponentFixture<Buyplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Buyplan],
    }).compileComponents();

    fixture = TestBed.createComponent(Buyplan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
