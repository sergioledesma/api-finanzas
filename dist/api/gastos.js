"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const router = (0, express_1.Router)();
// Agregar gasto
router.post("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    const gasto = req.body;
    if (!gasto.title || gasto.valor === undefined)
        return res.status(400).send("title y valor requeridos");
    await _firebase_1.db.collection("meses").doc(mesId).collection("gastos").add(gasto);
    res.send("Gasto agregado");
});
// Obtener gastos
router.get("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    const snapshot = await _firebase_1.db.collection("meses").doc(mesId).collection("gastos").get();
    const gastos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(gastos);
});
exports.default = router;
