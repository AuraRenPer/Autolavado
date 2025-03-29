import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionarServiciosPage } from './gestionar-servicios.page';

describe('GestionarServiciosPage', () => {
  let component: GestionarServiciosPage;
  let fixture: ComponentFixture<GestionarServiciosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
