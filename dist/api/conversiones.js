"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const router = (0, express_1.Router)();
// Agregar o actualizar conversión para un mes
router.post("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    const { tipo_cambio, valor, select } = req.body;
    if (!tipo_cambio || valor === undefined)
        return res.status(400).send("tipo_cambio y valor requeridos");
    await _firebase_1.db
        .collection("meses")
        .doc(mesId)
        .collection("conversiones")
        .doc("usd_ars")
        .set({ tipo_cambio, valor, select });
    res.send("Conversión guardada");
});
// Obtener conversión de un mes
router.get("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    const doc = await _firebase_1.db
        .collection("meses")
        .doc(mesId)
        .collection("conversiones")
        .doc("usd_ars")
        .get();
    if (!doc.exists)
        return res.status(404).send("Conversión no encontrada");
    res.send({ id: doc.id, ...doc.data() });
});
exports.default = router;
