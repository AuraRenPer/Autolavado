import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatDePacientesPage } from './chat-de-pacientes.page';

describe('ChatDePacientesPage', () => {
  let component: ChatDePacientesPage;
  let fixture: ComponentFixture<ChatDePacientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatDePacientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
