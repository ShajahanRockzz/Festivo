import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guestmessage } from './guestmessage';

describe('Guestmessage', () => {
  let component: Guestmessage;
  let fixture: ComponentFixture<Guestmessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guestmessage],
    }).compileComponents();

    fixture = TestBed.createComponent(Guestmessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
