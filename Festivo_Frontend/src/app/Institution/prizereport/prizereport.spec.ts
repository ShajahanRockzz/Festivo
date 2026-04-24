import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prizereport } from './prizereport';

describe('Prizereport', () => {
  let component: Prizereport;
  let fixture: ComponentFixture<Prizereport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prizereport],
    }).compileComponents();

    fixture = TestBed.createComponent(Prizereport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
