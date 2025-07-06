"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _firebase_1 = require("./_firebase");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Crear un nuevo mes
router.post("/", async (req, res) => {
    const { mes, año } = req.body;
    if (!mes || !año)
        return res.status(400).send("mes y año requeridos");
    const doc = await _firebase_1.db.collection("meses").add({ mes, año });
    res.send({ id: doc.id });
});
// Obtener todos los meses
router.get("/", authMiddleware_1.validarJWT, async (_, res) => {
    const snapshot = await _firebase_1.db.collection("meses").get();
    const meses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(meses);
});
exports.default = router;
