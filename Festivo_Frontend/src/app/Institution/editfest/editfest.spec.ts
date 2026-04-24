import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editfest } from './editfest';

describe('Editfest', () => {
  let component: Editfest;
  let fixture: ComponentFixture<Editfest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editfest],
    }).compileComponents();

    fixture = TestBed.createComponent(Editfest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
