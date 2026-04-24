import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editplan } from './editplan';

describe('Editplan', () => {
  let component: Editplan;
  let fixture: ComponentFixture<Editplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editplan],
    }).compileComponents();

    fixture = TestBed.createComponent(Editplan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
