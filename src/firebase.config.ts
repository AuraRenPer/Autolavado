import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';

// Inicializar Firebase con las credenciales del entorno
const firebaseApp = initializeApp(environment.firebase);
export const db = getFirestore(firebaseApp);
