import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesProveedorPage } from './solicitudes-proveedor.page';

describe('SolicitudesProveedorPage', () => {
  let component: SolicitudesProveedorPage;
  let fixture: ComponentFixture<SolicitudesProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
