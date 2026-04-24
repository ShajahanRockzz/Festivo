import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Totalrevenue } from './totalrevenue';

describe('Totalrevenue', () => {
  let component: Totalrevenue;
  let fixture: ComponentFixture<Totalrevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Totalrevenue],
    }).compileComponents();

    fixture = TestBed.createComponent(Totalrevenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
