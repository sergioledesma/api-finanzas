import { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./_firebase";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Agregar gasto
app.post("/:mesId", async (req, res) => {
  const { mesId } = req.params;
  const gasto = req.body;
  if (!gasto.title || gasto.valor === undefined)
    return res.status(400).send("title y valor requeridos");

  await db.collection("meses").doc(mesId).collection("gastos").add(gasto);
  res.send("Gasto agregado");
});

// Obtener gastos
app.get("/:mesId", async (req, res) => {
  const { mesId } = req.params;
  const snapshot = await db.collection("meses").doc(mesId).collection("gastos").get();
  const gastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(gastos);
});

export default (req: VercelRequest, res: VercelResponse) => app(req, res);
