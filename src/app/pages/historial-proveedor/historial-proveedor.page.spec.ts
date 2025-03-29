import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialProveedorPage } from './historial-proveedor.page';

describe('HistorialProveedorPage', () => {
  let component: HistorialProveedorPage;
  let fixture: ComponentFixture<HistorialProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
