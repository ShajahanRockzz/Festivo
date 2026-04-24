import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guesthome } from './guesthome';

describe('Guesthome', () => {
  let component: Guesthome;
  let fixture: ComponentFixture<Guesthome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guesthome],
    }).compileComponents();

    fixture = TestBed.createComponent(Guesthome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
