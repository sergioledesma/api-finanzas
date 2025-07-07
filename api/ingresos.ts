import { Router } from "express";
import { db } from "./_firebase";
import { mesIdByFecha } from "./middlewares/mesIdByFecha";

const router = Router();



// Agregar ingreso a un mes
router.post("/:date",mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const ingreso = req.body;
  if (!ingreso.tipo || ingreso.valor === undefined)
    return res.status(400).send("tipo y valor requeridos");

  await db
    .collection("meses")
    .doc(mesId)
    .collection("ingresos")
    .add(ingreso);

  res.send("Ingreso agregado");
});

// Obtener ingresos de un mes
router.get("/:date",mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const snapshot = await db
    .collection("meses")
    .doc(mesId)
    .collection("ingresos")
    .get();

  const ingresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(ingresos);
});

router.put("/:date/:ingresoId", mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const { ingresoId } = req.params;
  const data = req.body;

  try {
    await db
      .collection("meses")
      .doc(mesId)
      .collection("ingresos")
      .doc(ingresoId)
      .update(data);

    res.send("Ingreso actualizado");
  } catch (err) {
    res.status(404).send("Ingreso no encontrado o error al actualizar");
  }
});

export default router;
