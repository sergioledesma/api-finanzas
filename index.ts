import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { db } from "./api/_firebase";
import gastos from "./api/gastos";
import ingresos from "./api/ingresos";
import categorias from "./api/categorias";
import conversiones from "./api/conversiones";
import grupos from "./api/grupos";
import meses from "./api/meses";
import calcular from "./api/calcular";
import validarJWT from "./api/validarJWT";

const app = express();
app.use(cors());
app.use(express.json());

// Montar los endpoints como rutas
app.use("/api/meses", meses);
app.use("/api/gastos", gastos);
app.use("/api/ingresos", ingresos);
app.use("/api/categorias", categorias);
app.use("/api/conversiones", conversiones);
app.use("/api/grupos", grupos);
app.use("/api/calcular", calcular);
app.use("/api/validarjwt", validarJWT);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
