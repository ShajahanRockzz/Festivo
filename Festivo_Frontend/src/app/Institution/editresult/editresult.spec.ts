import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editresult } from './editresult';

describe('Editresult', () => {
  let component: Editresult;
  let fixture: ComponentFixture<Editresult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editresult],
    }).compileComponents();

    fixture = TestBed.createComponent(Editresult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
