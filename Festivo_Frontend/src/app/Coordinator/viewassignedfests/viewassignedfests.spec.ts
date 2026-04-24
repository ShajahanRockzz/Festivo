import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewassignedfests } from './viewassignedfests';

describe('Viewassignedfests', () => {
  let component: Viewassignedfests;
  let fixture: ComponentFixture<Viewassignedfests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewassignedfests],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewassignedfests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
