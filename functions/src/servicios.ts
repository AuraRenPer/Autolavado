import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.database(); // Instancia de la base de datos

// **Crear un servicio**
export const crearServicio = functions.https.onRequest(async (req, res) => {
    try {
        const serviciosRef = db.ref("servicios");

        const nuevoServicio = {
            cliente: req.body.cliente,
            vehiculo: req.body.vehiculo,
            tipoServicio: req.body.tipoServicio,
            fechaHora: req.body.fechaHora,
            estado: "pendiente",
        };

        const nuevoServicioRef = serviciosRef.push();
        await nuevoServicioRef.set(nuevoServicio);

        res.status(201).json({ mensaje: "Servicio registrado exitosamente", id: nuevoServicioRef.key });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: "Error al registrar el servicio", detalle: error.message });
        } else {
            res.status(500).json({ error: "Error desconocido al registrar el servicio" });
        }
    }
});

// **Obtener todos los servicios**
export const obtenerServicios = functions.https.onRequest(async (req, res) => {
  try {
      const snapshot = await db.ref("servicios").once("value");
      const data = snapshot.val();

      if (!data) {
          res.status(200).json([]); // Si no hay datos, devolver lista vacía
          return;
      }

      const servicios = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Record<string, unknown>) // Asegurar que el objeto sea tratado correctamente
      }));

      res.status(200).json(servicios);
  } catch (error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({ error: "Error al obtener servicios", detalle: error.message });
      } else {
          res.status(500).json({ error: "Error desconocido al obtener los servicios" });
      }
  }
});


// **Actualizar un servicio**
export const actualizarServicio = functions.https.onRequest(async (req, res) => {
  try {
      const { id, ...datosActualizados } = req.body;

      if (!id) {
          res.status(400).json({ error: "ID del servicio es requerido" });
          return;
      }

      await db.ref(`servicios/${id}`).update(datosActualizados);
      res.status(200).json({ mensaje: "Servicio actualizado correctamente" });
  } catch (error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({ error: "Error al actualizar el servicio", detalle: error.message });
      } else {
          res.status(500).json({ error: "Error desconocido al actualizar el servicio" });
      }
  }
});


// **Eliminar un servicio**
export const eliminarServicio = functions.https.onRequest(async (req, res) => {
  try {
      const { id } = req.body;
      if (!id) {
          res.status(400).json({ error: "ID del servicio es requerido" });
          return;
      }
      await db.ref(`servicios/${id}`).remove();
      res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({ error: "Error al eliminar el servicio", detalle: error.message });
      } else {
          res.status(500).json({ error: "Error desconocido al eliminar el servicio" });
      }
  }
});

