import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminmaster } from './adminmaster';

describe('Adminmaster', () => {
  let component: Adminmaster;
  let fixture: ComponentFixture<Adminmaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminmaster],
    }).compileComponents();

    fixture = TestBed.createComponent(Adminmaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
