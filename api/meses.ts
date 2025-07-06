import { Router } from "express";
import { db } from "./_firebase";
import { validarJWT } from "./middlewares/authMiddleware";

const router = Router();
// Crear un nuevo mes
router.post("/", async (req, res) => {
  const { mes, año } = req.body;
  if (!mes || !año) return res.status(400).send("mes y año requeridos");

  const doc = await db.collection("meses").add({ mes, año });
  res.send({ id: doc.id });
});

// Obtener todos los meses
router.get("/", validarJWT, async (_, res) => {
  const snapshot = await db.collection("meses").get();
  const meses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(meses);
});

export default router;
