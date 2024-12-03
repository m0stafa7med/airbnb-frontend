import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDateComponent } from './booking-date.component';

describe('BookingDateComponent', () => {
  let component: BookingDateComponent;
  let fixture: ComponentFixture<BookingDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
