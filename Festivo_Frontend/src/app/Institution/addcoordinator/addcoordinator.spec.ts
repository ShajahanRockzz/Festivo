import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcoordinator } from './addcoordinator';

describe('Addcoordinator', () => {
  let component: Addcoordinator;
  let fixture: ComponentFixture<Addcoordinator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addcoordinator],
    }).compileComponents();

    fixture = TestBed.createComponent(Addcoordinator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
