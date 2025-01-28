import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  chatId: string | null = null; // ID del chat actual
  messages: Array<{ sender: string; content: string; timestamp: Date }> = []; // Lista de mensajes
  newMessage: string = ''; // Mensaje nuevo a enviar
  currentUserId: string | null = null; // Usuario autenticado

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  async ngOnInit() {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        this.currentUserId = currentUser.uid; // Obtener el ID del usuario autenticado
      }

      this.chatId = this.route.snapshot.paramMap.get('chatId'); // Obtener el ID del chat desde la URL

      if (this.chatId) {
        this.messages = await this.chatService.getMessages(this.chatId); // Cargar mensajes
      }
    } catch (error) {
      console.error('Error al cargar la página del chat:', error);
    }
  }

  async sendMessage() {
    try {
      if (this.chatId && this.newMessage.trim() && this.currentUserId) {
        await this.chatService.sendMessage(this.chatId, this.currentUserId, this.newMessage); // Enviar mensaje
        this.messages.push({
          sender: this.currentUserId,
          content: this.newMessage,
          timestamp: new Date(),
        });
        this.newMessage = ''; // Limpiar campo de entrada
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
}
