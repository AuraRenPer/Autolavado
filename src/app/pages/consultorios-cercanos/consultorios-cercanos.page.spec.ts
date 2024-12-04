import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultoriosCercanosPage } from './consultorios-cercanos.page';

describe('ConsultoriosCercanosPage', () => {
  let component: ConsultoriosCercanosPage;
  let fixture: ComponentFixture<ConsultoriosCercanosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultoriosCercanosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
