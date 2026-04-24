import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewplan } from './viewplan';

describe('Viewplan', () => {
  let component: Viewplan;
  let fixture: ComponentFixture<Viewplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewplan],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewplan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
