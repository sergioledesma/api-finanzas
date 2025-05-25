"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gastos_1 = __importDefault(require("./api/gastos"));
const ingresos_1 = __importDefault(require("./api/ingresos"));
const categorias_1 = __importDefault(require("./api/categorias"));
const conversiones_1 = __importDefault(require("./api/conversiones"));
const grupos_1 = __importDefault(require("./api/grupos"));
const meses_1 = __importDefault(require("./api/meses"));
const calcular_1 = __importDefault(require("./api/calcular"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Montar los endpoints como rutas
app.use("/api/meses", meses_1.default);
app.use("/api/gastos", gastos_1.default);
app.use("/api/ingresos", ingresos_1.default);
app.use("/api/categorias", categorias_1.default);
app.use("/api/conversiones", conversiones_1.default);
app.use("/api/grupos", grupos_1.default);
app.use("/api/calcular", calcular_1.default);
// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
