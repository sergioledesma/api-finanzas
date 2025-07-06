"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { idToken } = req.body;
    if (!idToken)
        return res.status(400).send("idToken requerido");
    try {
        const decoded = await firebase_admin_1.default.auth().verifyIdToken(idToken);
        res.send({
            uid: decoded.uid,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
        });
    }
    catch (err) {
        res.status(401).send("Token inválido");
    }
});
exports.default = router;
