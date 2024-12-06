import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrabarConsultaPage } from './grabar-consulta.page';

describe('GrabarConsultaPage', () => {
  let component: GrabarConsultaPage;
  let fixture: ComponentFixture<GrabarConsultaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrabarConsultaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
