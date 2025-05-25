"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const router = (0, express_1.Router)();
// Agregar ingreso a un mes
router.post("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    const ingreso = req.body;
    if (!ingreso.tipo || ingreso.valor === undefined)
        return res.status(400).send("tipo y valor requeridos");
    await _firebase_1.db
        .collection("meses")
        .doc(mesId)
        .collection("ingresos")
        .add(ingreso);
    res.send("Ingreso agregado");
});
// Obtener ingresos de un mes
router.get("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    const snapshot = await _firebase_1.db
        .collection("meses")
        .doc(mesId)
        .collection("ingresos")
        .get();
    const ingresos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(ingresos);
});
exports.default = router;
