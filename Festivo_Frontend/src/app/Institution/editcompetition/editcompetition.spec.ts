import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editcompetition } from './editcompetition';

describe('Editcompetition', () => {
  let component: Editcompetition;
  let fixture: ComponentFixture<Editcompetition>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editcompetition],
    }).compileComponents();

    fixture = TestBed.createComponent(Editcompetition);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
