import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async setData(key: string, value: any): Promise<void> {
    try {
      await this._storage?.set(key, value);
    } catch (error) {
      console.error('Error al guardar datos:', error);
    }
  }

  async getData(key: string): Promise<any> {
    try {
      return await this._storage?.get(key);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return null;
    }
  }
}
