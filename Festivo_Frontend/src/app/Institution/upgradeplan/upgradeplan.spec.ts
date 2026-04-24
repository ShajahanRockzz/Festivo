import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Upgradeplan } from './upgradeplan';

describe('Upgradeplan', () => {
  let component: Upgradeplan;
  let fixture: ComponentFixture<Upgradeplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Upgradeplan],
    }).compileComponents();

    fixture = TestBed.createComponent(Upgradeplan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
