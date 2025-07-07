import { Router } from "express";
import { db } from "./_firebase";

const router = Router();

// Crear categoría
router.post("/", async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).send("Nombre requerido");

  const doc = await db.collection("categorias").add({ nombre });
  res.send({ id: doc.id });
});

// Obtener todas las categorías
router.get("/", async (_, res) => {
  const snapshot = await db.collection("categorias").get();
  const categorias = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(categorias);
});

// Editar categoría
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  await db.collection("categorias").doc(id).update({ nombre });
  res.send("Categoría actualizada");
});

// Eliminar categoría
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("categorias").doc(id).delete();
  res.send("Categoría eliminada");
});

export default router;
