import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue, push } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private database = getDatabase();

  async getMessages(chatId: string) {
    const chatRef = ref(this.database, `chats/${chatId}/messages`);
    const messages: Array<{ sender: string; content: string; timestamp: Date }> = [];
  
    onValue(chatRef, (snapshot) => {
      const tempMessages: Array<{ sender: string; content: string; timestamp: Date }> = [];
      snapshot.forEach((childSnapshot) => {
        const message = childSnapshot.val();
        tempMessages.push({
          sender: message.sender,
          content: message.content,
          timestamp: new Date(message.timestamp), // Convertir a objeto Date
        });
      });
      messages.push(...tempMessages);
    });
  
    return messages;
  }

  async sendMessage(chatId: string, senderId: string, content: string) {
    const chatRef = ref(this.database, `chats/${chatId}/messages`);
    const newMessage = {
      sender: senderId,
      content,
      timestamp: new Date().toISOString(),
    };
    await push(chatRef, newMessage);
  }

  async getUsers(): Promise<Array<{ id: string; email: string }>> {
    const usersRef = ref(this.database, `users`);
    const users: Array<{ id: string; email: string }> = [];

    return new Promise((resolve, reject) => {
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.keys(data).forEach((key) => {
            users.push({
              id: key,
              email: data[key].email || 'Sin correo',
            });
          });
        }
        resolve(users);
      }, reject);
    });
  }

  async createChat(userId1: string, userId2: string): Promise<string> {
    const chatId = `${userId1}_${userId2}`;
    const chatRef = ref(this.database, `chats/${chatId}`);

    await push(chatRef, {
      userId1,
      userId2,
      timestamp: new Date().toISOString(),
    });

    return chatId;
  }
}
