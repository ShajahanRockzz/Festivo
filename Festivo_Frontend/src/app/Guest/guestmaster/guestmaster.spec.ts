import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guestmaster } from './guestmaster';

describe('Guestmaster', () => {
  let component: Guestmaster;
  let fixture: ComponentFixture<Guestmaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guestmaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Guestmaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
