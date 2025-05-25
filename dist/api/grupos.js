"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const router = (0, express_1.Router)();
// Crear grupo
router.post("/", async (req, res) => {
    const { nombre } = req.body;
    if (!nombre)
        return res.status(400).send("Nombre requerido");
    const doc = await _firebase_1.db.collection("grupos").add({ nombre });
    res.send({ id: doc.id });
});
// Obtener todos los grupos
router.get("/", async (_, res) => {
    const snapshot = await _firebase_1.db.collection("grupos").get();
    const grupos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(grupos);
});
// Editar grupo
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    await _firebase_1.db.collection("grupos").doc(id).update({ nombre });
    res.send("Grupo actualizado");
});
// Eliminar grupo
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await _firebase_1.db.collection("grupos").doc(id).delete();
    res.send("Grupo eliminado");
});
exports.default = router;
