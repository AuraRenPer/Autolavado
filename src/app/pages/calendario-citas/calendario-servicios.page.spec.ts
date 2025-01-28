import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioServiciosPage } from './calendario-servicios.page';

describe('CalendarioCitasPage', () => {
  let component: CalendarioServiciosPage;
  let fixture: ComponentFixture<CalendarioServiciosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
