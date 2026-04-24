import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coordinatormaster } from './coordinatormaster';

describe('Coordinatormaster', () => {
  let component: Coordinatormaster;
  let fixture: ComponentFixture<Coordinatormaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coordinatormaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Coordinatormaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
