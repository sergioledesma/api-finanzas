import { Router } from "express";
import { db } from "./_firebase";

const router = Router();



// Agregar ingreso a un mes
router.post("/:mesId", async (req, res) => {
  const { mesId } = req.params;
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
router.get("/:mesId", async (req, res) => {
  const { mesId } = req.params;
  const snapshot = await db
    .collection("meses")
    .doc(mesId)
    .collection("ingresos")
    .get();

  const ingresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(ingresos);
});

export default router;
