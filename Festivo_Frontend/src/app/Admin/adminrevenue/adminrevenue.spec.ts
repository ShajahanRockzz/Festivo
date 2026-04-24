import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminrevenue } from './adminrevenue';

describe('Adminrevenue', () => {
  let component: Adminrevenue;
  let fixture: ComponentFixture<Adminrevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminrevenue],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminrevenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
