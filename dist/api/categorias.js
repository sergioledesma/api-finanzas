"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const router = (0, express_1.Router)();
// Crear categoría
router.post("/", async (req, res) => {
    const { nombre } = req.body;
    if (!nombre)
        return res.status(400).send("Nombre requerido");
    const doc = await _firebase_1.db.collection("categorias").add({ nombre });
    res.send({ id: doc.id });
});
// Obtener todas las categorías
router.get("/", async (_, res) => {
    const snapshot = await _firebase_1.db.collection("categorias").get();
    const categorias = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(categorias);
});
// Editar categoría
router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    await _firebase_1.db.collection("categorias").doc(id).update({ nombre });
    res.send("Categoría actualizada");
});
// Eliminar categoría
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await _firebase_1.db.collection("categorias").doc(id).delete();
    res.send("Categoría eliminada");
});
exports.default = router;
