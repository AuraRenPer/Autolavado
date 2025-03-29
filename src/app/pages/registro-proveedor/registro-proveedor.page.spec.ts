import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroProveedorPage } from './registro-proveedor.page';

describe('RegistroProveedorPage', () => {
  let component: RegistroProveedorPage;
  let fixture: ComponentFixture<RegistroProveedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
