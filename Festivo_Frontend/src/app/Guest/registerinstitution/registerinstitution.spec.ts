import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registerinstitution } from './registerinstitution';

describe('Registerinstitution', () => {
  let component: Registerinstitution;
  let fixture: ComponentFixture<Registerinstitution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registerinstitution],
    }).compileComponents();

    fixture = TestBed.createComponent(Registerinstitution);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
