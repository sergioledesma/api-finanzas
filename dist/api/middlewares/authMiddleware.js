"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = validarJWT;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
async function validarJWT(req, res, next) {
    const idToken = req.headers.authorization?.split("Bearer ")[1] || req.body.idToken;
    if (!idToken)
        return res.status(401).send("Token requerido");
    try {
        const decoded = await firebase_admin_1.default.auth().verifyIdToken(idToken);
        // Puedes adjuntar el usuario al request si lo necesitas
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).send("Token inválido o vencido");
    }
}
