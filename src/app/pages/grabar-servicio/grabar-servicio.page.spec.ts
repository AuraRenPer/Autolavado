import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrabarServicioPage } from './grabar-servicio.page';

describe('GrabarConsultaPage', () => {
  let component: GrabarServicioPage;
  let fixture: ComponentFixture<GrabarServicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrabarServicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
