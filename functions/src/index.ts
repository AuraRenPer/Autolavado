import * as admin from 'firebase-admin';
import { crearServicio } from './servicios';

admin.initializeApp();

// Exporta las funciones individualmente
exports.crearServicio = crearServicio;
