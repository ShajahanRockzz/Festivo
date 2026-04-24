import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festpreview } from './festpreview';

describe('Festpreview', () => {
  let component: Festpreview;
  let fixture: ComponentFixture<Festpreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festpreview],
    }).compileComponents();

    fixture = TestBed.createComponent(Festpreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
