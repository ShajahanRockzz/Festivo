import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Institutionmaster } from './institutionmaster';

describe('Institutionmaster', () => {
  let component: Institutionmaster;
  let fixture: ComponentFixture<Institutionmaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Institutionmaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Institutionmaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
