import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-de-clientes',
  templateUrl: './chat-de-clientes.page.html',
  styleUrls: ['./chat-de-clientes.page.scss'],
})
export class ChatDeClientesPage implements OnInit {
  users: any[] = []; // Lista de usuarios disponibles para chatear
  currentUser: any = null; // Usuario autenticado actual

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      console.log('Iniciando la página de Chat de Clientes.');

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No hay un usuario autenticado.');
        return;
      }

      this.currentUser = {
        uid: currentUser.uid,
        email: currentUser.email,
      };
      console.log('Usuario actual cargado:', this.currentUser);

      // Obtener lista de usuarios disponibles para el chat
      const allUsers = await this.chatService.getUsers();
      this.users = allUsers.filter((user) => user.id !== this.currentUser.uid);
      console.log('Lista de usuarios para el chat:', this.users);
    } catch (error) {
      console.error('Error al inicializar la página:', error);
    }
  }

  async openChat(otherUserId: string) {
    try {
      if (!this.currentUser) {
        console.error('Usuario no autenticado.');
        return;
      }

      const chatId = await this.chatService.createChat(this.currentUser.uid, otherUserId);
      this.router.navigate(['/chat-room', chatId]);
    } catch (error) {
      console.error('Error al abrir el chat:', error);
    }
  }
}
