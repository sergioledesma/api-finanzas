import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export async function validarJWT(req: Request, res: Response, next: NextFunction) {
  const idToken = req.headers.authorization?.split("Bearer ")[1] || req.body.idToken;
  if (!idToken) return res.status(401).send("Token requerido");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Puedes adjuntar el usuario al request si lo necesitas
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Token inválido o vencido");
  }
}