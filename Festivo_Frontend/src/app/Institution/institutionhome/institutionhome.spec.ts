import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Institutionhome } from './institutionhome';

describe('Institutionhome', () => {
  let component: Institutionhome;
  let fixture: ComponentFixture<Institutionhome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Institutionhome],
    }).compileComponents();

    fixture = TestBed.createComponent(Institutionhome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
