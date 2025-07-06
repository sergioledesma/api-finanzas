import { Router } from "express";
import admin from "firebase-admin";

const router = Router();

router.post("/", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).send("idToken requerido");

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.send({
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });
  } catch (err) {
    res.status(401).send("Token inválido");
  }
});

export default router;
