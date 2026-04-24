import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Festrevenuereport } from './festrevenuereport';

describe('Festrevenuereport', () => {
  let component: Festrevenuereport;
  let fixture: ComponentFixture<Festrevenuereport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Festrevenuereport],
    }).compileComponents();

    fixture = TestBed.createComponent(Festrevenuereport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
