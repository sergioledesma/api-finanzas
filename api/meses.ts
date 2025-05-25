import { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./_firebase";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Crear un nuevo mes
app.post("/", async (req, res) => {
  const { mes, año } = req.body;
  if (!mes || !año) return res.status(400).send("mes y año requeridos");

  const doc = await db.collection("meses").add({ mes, año });
  res.send({ id: doc.id });
});

// Obtener todos los meses
app.get("/", async (_, res) => {
  const snapshot = await db.collection("meses").get();
  const meses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(meses);
});

export default (req: VercelRequest, res: VercelResponse) => app(req, res);
