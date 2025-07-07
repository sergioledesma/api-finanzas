import { Router } from "express";
import { db } from "./_firebase";

const router = Router();


// Crear grupo
router.post("/", async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).send("Nombre requerido");

  const doc = await db.collection("grupos").add({ nombre });
  res.send({ id: doc.id });
});

// Obtener todos los grupos
router.get("/", async (_, res) => {
  const snapshot = await db.collection("grupos").get();
  const grupos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(grupos);
});

// Editar grupo
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  await db.collection("grupos").doc(id).update({ nombre });
  res.send("Grupo actualizado");
});

// Eliminar grupo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("grupos").doc(id).delete();
  res.send("Grupo eliminado");
});

export default router;