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
  chatId: string | null = null;
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: string | null = null;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {}

  async ngOnInit() {
    try {
      console.log('ChatRoomPage: Iniciando la página del chat room.');

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        this.currentUserId = currentUser.uid;
      }
      console.log('ChatRoomPage: Usuario actual:', this.currentUserId);

      this.chatId = this.route.snapshot.paramMap.get('chatId');
      console.log('ChatRoomPage: ID del chat:', this.chatId);

      if (this.chatId) {
        this.messages = await this.chatService.getMessages(this.chatId);
        console.log('ChatRoomPage: Mensajes del chat cargados:', this.messages);
      }
    } catch (error) {
      console.error('ChatRoomPage: Error al cargar la página del chat:', error);
    }
  }

  async sendMessage() {
    try {
      console.log('ChatRoomPage: Enviando mensaje...');

      if (this.chatId && this.newMessage.trim() && this.currentUserId) {
        await this.chatService.sendMessage(this.chatId, this.currentUserId, this.newMessage);
        this.messages.push({
          sender: this.currentUserId,
          content: this.newMessage,
          timestamp: new Date(),
        });
        console.log('ChatRoomPage: Mensaje enviado:', this.newMessage);

        this.newMessage = '';
      }
    } catch (error) {
      console.error('ChatRoomPage: Error al enviar el mensaje:', error);
    }
  }
}
