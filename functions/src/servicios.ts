import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.database(); // Instancia de la base de datos


export const crearServicio = functions.https.onRequest(async (req, res) => {
    try {
      const serviciosRef = db.ref("servicios"); // Acceder a la colección de servicios
  
      const nuevoServicio = {
        cliente: req.body.cliente,
        vehiculo: req.body.vehiculo,
        tipoServicio: req.body.tipoServicio,
        fechaHora: req.body.fechaHora,
        estado: "pendiente",
      };
  
      const nuevoServicioRef = serviciosRef.push();
      await nuevoServicioRef.set(nuevoServicio);
  
      res.status(201).json({ mensaje: "Servicio registrado exitosamente" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: "Error al registrar el servicio", detalle: error.message });
      } else {
        res.status(500).json({ error: "Error desconocido al registrar el servicio" });
      }
    }
  });
  
  
