import { Router } from "express";
import { db } from "./_firebase";
import { mesIdByFecha } from "./middlewares/mesIdByFecha";

const router = Router();

// Agregar o actualizar conversión para un mes
router.post("/:date",mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const { tipo_cambio, valor, select } = req.body;
  if (!tipo_cambio || valor === undefined)
    return res.status(400).send("tipo_cambio y valor requeridos");

  await db
    .collection("meses")
    .doc(mesId)
    .collection("conversiones")
    .add({ tipo_cambio, valor, select });

  res.send("Conversión guardada");
});

// Obtener conversión de un mes
router.get("/:date",mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const snapshot = await db
    .collection("meses")
    .doc(mesId)
    .collection("conversiones")
    .get();

  if (snapshot.empty) return res.status(404).send("Conversión no encontrada");
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.send(data);
});

//editar conversiones
router.put("/:date/:conversionId", mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const { conversionId } = req.params;
  const data = req.body;

  try {
    await db
      .collection("meses")
      .doc(mesId)
      .collection("conversiones")
      .doc(conversionId)
      .update(data);

    res.send("conversion actualizada");
  } catch (err) {
    res.status(404).send("conversion no encontrado o error al actualizar");
  }
});
export default router;
