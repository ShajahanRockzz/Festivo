import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewcompetitindetailsparticiapant } from './viewcompetitindetailsparticiapant';

describe('Viewcompetitindetailsparticiapant', () => {
  let component: Viewcompetitindetailsparticiapant;
  let fixture: ComponentFixture<Viewcompetitindetailsparticiapant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewcompetitindetailsparticiapant],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewcompetitindetailsparticiapant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
