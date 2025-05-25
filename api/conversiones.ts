import { Router } from "express";
import { db } from "./_firebase";

const router = Router();

// Agregar o actualizar conversión para un mes
router.post("/:mesId", async (req, res) => {
  const { mesId } = req.params;
  const { tipo_cambio, valor, select } = req.body;
  if (!tipo_cambio || valor === undefined)
    return res.status(400).send("tipo_cambio y valor requeridos");

  await db
    .collection("meses")
    .doc(mesId)
    .collection("conversiones")
    .doc("usd_ars")
    .set({ tipo_cambio, valor, select });

  res.send("Conversión guardada");
});

// Obtener conversión de un mes
router.get("/:mesId", async (req, res) => {
  const { mesId } = req.params;
  const doc = await db
    .collection("meses")
    .doc(mesId)
    .collection("conversiones")
    .doc("usd_ars")
    .get();

  if (!doc.exists) return res.status(404).send("Conversión no encontrada");
  res.send({ id: doc.id, ...doc.data() });
});

export default router;
