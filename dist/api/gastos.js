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
    // Extraer IDs únicos de categorías y grupos
    const categoriaIds = [...new Set(gastos.map(g => g.category).filter(Boolean))];
    const grupoIds = [...new Set(gastos.map(g => g.grupo).filter(Boolean))];
    // Obtener categorías
    let categoriasMap = {};
    if (categoriaIds.length) {
        const categoriasSnap = await _firebase_1.db.collection("categorias").where("__name__", "in", categoriaIds).get();
        categoriasMap = Object.fromEntries(categoriasSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }]));
    }
    // Obtener grupos
    let gruposMap = {};
    if (grupoIds.length) {
        const gruposSnap = await _firebase_1.db.collection("grupos").where("__name__", "in", grupoIds).get();
        gruposMap = Object.fromEntries(gruposSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }]));
    }
    // Reemplazar IDs por objetos completos
    const gastosCompletos = gastos.map(gasto => ({
        ...gasto,
        category: gasto.id && gasto.category ? categoriasMap[gasto.category] || null : null,
        grupo: gasto.id && gasto.grupo ? gruposMap[gasto.grupo] || null : null,
    }));
    res.send(gastosCompletos);
});
exports.default = router;
