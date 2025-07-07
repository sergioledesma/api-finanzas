import { Request, Response, NextFunction } from "express";
import { db } from "../_firebase";

/**
 * Middleware que convierte un parámetro fecha (YYYYMM) en mesId.
 * Si no existe el mes, lo crea.
 * Agrega req.mesId con el id del documento de meses.
 */
export async function mesIdByFecha(req: Request, res: Response, next: NextFunction) {
  const { date } = req.params;
  if (!/^\d{6}$/.test(date)) return res.status(400).send("Formato de fecha inválido (YYYYMM)");

  const año = parseInt(date.slice(0, 4), 10);
  const mes = parseInt(date.slice(4, 6), 10);
  // Buscar el mes en la colección
  const snapshot = await db.collection("meses")
    .where("año", "==", año)
    .where("mes", "==", mes)
    .get();
  let mesId: string;
  if (!snapshot.empty) {
    mesId = snapshot.docs[0].id;
  } else {
    // Crear el mes si no existe
    const doc = await db.collection("meses").add({ año, mes });
    mesId = doc.id;
  }

  // Adjuntar el mesId al request
  (req as any).mesId = mesId;
  next();
}