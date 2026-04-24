import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewcoordinators } from './viewcoordinators';

describe('Viewcoordinators', () => {
  let component: Viewcoordinators;
  let fixture: ComponentFixture<Viewcoordinators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewcoordinators],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewcoordinators);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
