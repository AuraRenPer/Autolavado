import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiciosPasadosPage } from './consultas-pasadas.page';

describe('ConsultasPasadasPage', () => {
  let component: ServiciosPasadosPage;
  let fixture: ComponentFixture<ServiciosPasadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiciosPasadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
