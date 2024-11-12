import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioCitasPage } from './calendario-citas.page';

describe('CalendarioCitasPage', () => {
  let component: CalendarioCitasPage;
  let fixture: ComponentFixture<CalendarioCitasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioCitasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
