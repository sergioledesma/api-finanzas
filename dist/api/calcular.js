"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const router = (0, express_1.Router)();
router.post("/:mesId", async (req, res) => {
    const { mesId } = req.params;
    // Gastos
    const gastosSnap = await _firebase_1.db.collection("meses").doc(mesId).collection("gastos").get();
    const gastos = gastosSnap.docs.map((d) => d.data());
    const totalGastos = gastos
        .filter((g) => !g.saldado && g.select)
        .reduce((acc, g) => acc + g.valor, 0);
    // Ingresos
    const ingresosSnap = await _firebase_1.db.collection("meses").doc(mesId).collection("ingresos").get();
    const ingresos = ingresosSnap.docs.map((d) => d.data());
    const totalIngresos = ingresos
        .filter((i) => i.select)
        .reduce((acc, i) => acc + i.valor, 0);
    const restante = totalIngresos - totalGastos;
    // Guarda totales
    await _firebase_1.db.collection("meses").doc(mesId).collection("totales").doc("resumen").set({
        totalGastos,
        totalIngresos,
        restante,
    });
    res.send({ totalGastos, totalIngresos, restante });
});
exports.default = router;
