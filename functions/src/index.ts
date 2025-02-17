import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const crearServicio = functions.https.onRequest(async (req, res) => {
    try {
      const { cliente, vehiculo, tipoServicio, fechaHora } = req.body;
  
      if (!cliente || !vehiculo || !tipoServicio || !fechaHora) {
        res.status(400).json({ error: "Faltan datos obligatorios" });
        return;
      }
  
      const db = admin.firestore();
      const servicioRef = db.collection("servicios").doc();
      
      await servicioRef.set({
        cliente,
        vehiculo,
        tipoServicio,
        fechaHora,
        estado: "pendiente",
      });
  
      res.status(201).json({ mensaje: "Servicio registrado exitosamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al registrar el servicio", detalle: (error as Error).message });
    }
  });
  
