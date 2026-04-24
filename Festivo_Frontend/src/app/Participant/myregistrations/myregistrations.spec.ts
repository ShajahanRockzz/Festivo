import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myregistrations } from './myregistrations';

describe('Myregistrations', () => {
  let component: Myregistrations;
  let fixture: ComponentFixture<Myregistrations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myregistrations],
    }).compileComponents();

    fixture = TestBed.createComponent(Myregistrations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
