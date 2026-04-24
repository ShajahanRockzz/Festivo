import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewallfests } from './viewallfests';

describe('Viewallfests', () => {
  let component: Viewallfests;
  let fixture: ComponentFixture<Viewallfests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewallfests],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewallfests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
