import * as functions from "firebase-functions";
import { db } from "../../src/firebase.config";

export const obtenerServicios = functions.https.onRequest(async (req, res) => {
    try {
        const snapshot = await db.collection("servicios").get();
        const servicios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(servicios);
    } catch (error: unknown) {
        res.status(500).json({ error: "Error al obtener servicios", detalle: (error as Error).message });
    }
});

export const actualizarServicio = functions.https.onRequest(async (req, res) => {
    try {
        const { id, ...datosActualizados } = req.body;
        if (!id) {
            res.status(400).json({ error: "ID del servicio es requerido" });
            return;
        }
        await db.collection("servicios").doc(id).update(datosActualizados);
        res.status(200).json({ mensaje: "Servicio actualizado correctamente" });
    } catch (error: unknown) {
        res.status(500).json({ error: "Error al actualizar el servicio", detalle: (error as Error).message });
    }
});
