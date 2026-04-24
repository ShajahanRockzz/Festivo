import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Assigncoordinator } from './assigncoordinator';

describe('Assigncoordinator', () => {
  let component: Assigncoordinator;
  let fixture: ComponentFixture<Assigncoordinator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Assigncoordinator],
    }).compileComponents();

    fixture = TestBed.createComponent(Assigncoordinator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
