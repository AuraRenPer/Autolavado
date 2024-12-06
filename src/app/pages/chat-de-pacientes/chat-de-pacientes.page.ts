import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-de-pacientes',
  templateUrl: './chat-de-pacientes.page.html',
  styleUrls: ['./chat-de-pacientes.page.scss'],
})
export class ChatDePacientesPage implements OnInit {
  users: any[] = [];
  currentUser: any = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      console.log('ngOnInit: Iniciando la página de Chat de Pacientes.');

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('ngOnInit: No hay un usuario autenticado.');
        return;
      }

      this.currentUser = {
        uid: currentUser.uid,
        email: currentUser.email,
      };
      console.log('ngOnInit: Usuario actual cargado:', this.currentUser);

      console.log('ngOnInit: Cargando lista de usuarios...');
      const allUsers = await this.chatService.getUsers();
      console.log('ngOnInit: Lista de usuarios obtenida:', allUsers);

      this.users = allUsers.filter((user) => user.id !== this.currentUser.uid);
      console.log('ngOnInit: Lista de usuarios filtrada:', this.users);

    } catch (error) {
      console.error('ngOnInit: Error al inicializar la página:', error);
    }
  }

  async openChat(otherUserId: string) {
    try {
      console.log('openChat: Intentando abrir un chat con el usuario:', otherUserId);

      if (!this.currentUser) {
        console.error('openChat: Usuario no autenticado.');
        return;
      }

      const chatId = await this.chatService.createChat(this.currentUser.uid, otherUserId);
      console.log('openChat: Chat creado o encontrado con ID:', chatId);

      // Navegar a la página del chat
      this.router.navigate(['/chat-room', chatId]);
      console.log('openChat: Navegación a ChatRoomPage realizada.');
      
    } catch (error) {
      console.error('openChat: Error al abrir o crear el chat:', error);
    }
  }
}
