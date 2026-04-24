import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createplan } from './createplan';

describe('Createplan', () => {
  let component: Createplan;
  let fixture: ComponentFixture<Createplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createplan],
    }).compileComponents();

    fixture = TestBed.createComponent(Createplan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
