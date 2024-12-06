import { Injectable } from '@angular/core';
import { collection, getDocs, addDoc, query, where, orderBy, getFirestore } from 'firebase/firestore';
import { db } from '../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  public db = db; // Exponer la instancia de Firestore como una propiedad pública

  constructor() {}

  // Obtener documentos de una colección
  async getCollection(collectionName: string) {
    const colRef = collection(this.db, collectionName);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Agregar un documento a una colección
  async addDocument(collectionName: string, data: any) {
    const colRef = collection(this.db, collectionName);
    return await addDoc(colRef, data);
  }

  // Consultar una colección con condiciones
  async queryCollection(collectionName: string, field: string, operator: any, value: any) {
    const colRef = collection(this.db, collectionName);
    const q = query(colRef, where(field, operator, value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Obtener mensajes de un chat ordenados por fecha
  async getChatMessages(chatId: string) {
    const messagesCollection = collection(this.db, `chats/${chatId}/messages`);
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Agregar un mensaje a un chat
  async addMessageToChat(chatId: string, message: any) {
    const messagesCollection = collection(this.db, `chats/${chatId}/messages`);
    return await addDoc(messagesCollection, message);
  }
}
