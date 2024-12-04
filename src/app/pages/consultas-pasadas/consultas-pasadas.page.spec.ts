import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultasPasadasPage } from './consultas-pasadas.page';

describe('ConsultasPasadasPage', () => {
  let component: ConsultasPasadasPage;
  let fixture: ComponentFixture<ConsultasPasadasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultasPasadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
