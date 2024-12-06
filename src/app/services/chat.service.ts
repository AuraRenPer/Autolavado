import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firebaseService: FirebaseService) {}

  // Obtener la lista de usuarios registrados
  async getUsers() {
    return this.firebaseService.getCollection('users');
  }

  // Crear o encontrar un chat entre dos usuarios
  async createChat(user1: string, user2: string) {
    console.log('Iniciando creación de chat...');
    console.log('UID del usuario actual:', user1);
    console.log('UID del otro usuario:', user2);

    try {
      // Buscar un chat existente donde ambos usuarios estén presentes
      const chats = await this.firebaseService.queryCollection(
        'chats',
        'users',
        'array-contains',
        user1
      );
      console.log('Chats encontrados para el usuario actual:', chats);

      // Verificar si ya existe un chat con ambos usuarios
      const existingChat = chats.find((chat: any) => chat.users.includes(user2));
      if (existingChat) {
        console.log('Chat existente encontrado:', existingChat.id);
        return existingChat.id; // Retorna el ID del chat existente
      }

      // Crear un nuevo chat si no existe
      const chatData = {
        users: [user1, user2], // Ambos UID deben estar presentes
        lastMessage: '',
        lastTimestamp: new Date(),
      };

      console.log('Creando un nuevo chat con los datos:', chatData);

      const chatDoc = await this.firebaseService.addDocument('chats', chatData);
      console.log('Nuevo chat creado con ID:', chatDoc.id);
      return chatDoc.id;

    } catch (error) {
      console.error('Error al crear el chat:', error);
      throw error;
    }
  }

  // Obtener los mensajes de un chat
  async getMessages(chatId: string) {
    console.log(`Obteniendo mensajes para el chat con ID: ${chatId}`);
    return this.firebaseService.getChatMessages(chatId);
  }

  // Enviar un mensaje en un chat
  async sendMessage(chatId: string, sender: string, content: string) {
    console.log(`Enviando mensaje en el chat con ID: ${chatId}`);
    console.log('Datos del mensaje:', { sender, content });

    try {
      const messageData = {
        sender,
        content,
        timestamp: new Date(),
      };

      // Agregar el mensaje al chat
      await this.firebaseService.addMessageToChat(chatId, messageData);
      console.log('Mensaje agregado a la colección de mensajes.');

      // Actualizar el documento del chat con el último mensaje y la hora
      await updateDoc(this.getChatDoc(chatId), {
        lastMessage: content,
        lastTimestamp: new Date(),
      });
      console.log('Chat actualizado con el último mensaje.');

    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      throw error;
    }
  }

  // Helpers internos
  private getChatDoc(chatId: string) {
    console.log(`Obteniendo referencia al documento del chat con ID: ${chatId}`);
    return doc(this.firebaseService.db, `chats/${chatId}`);
  }

  private getMessagesCollection(chatId: string) {
    console.log(`Obteniendo referencia a la colección de mensajes para el chat con ID: ${chatId}`);
    return collection(this.firebaseService.db, `chats/${chatId}/messages`);
  }
}
