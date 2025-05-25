import { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./_firebase";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Agregar o actualizar conversión para un mes
app.post("/:mesId", async (req, res) => {
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
app.get("/:mesId", async (req, res) => {
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

export default (req: VercelRequest, res: VercelResponse) => app(req, res);
