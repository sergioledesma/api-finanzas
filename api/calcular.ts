import { Router } from "express";
import { db } from "./_firebase";

const router = Router();

router.post("/:mesId", async (req, res) => {
  const { mesId } = req.params;

  // Gastos
  const gastosSnap = await db.collection("meses").doc(mesId).collection("gastos").get();
  const gastos = gastosSnap.docs.map((d) => d.data());
  const totalGastos = gastos
    .filter((g: any) => !g.saldado && g.select)
    .reduce((acc, g: any) => acc + g.valor, 0);

  // Ingresos
  const ingresosSnap = await db.collection("meses").doc(mesId).collection("ingresos").get();
  const ingresos = ingresosSnap.docs.map((d) => d.data());
  const totalIngresos = ingresos
    .filter((i: any) => i.select)
    .reduce((acc, i: any) => acc + i.valor, 0);

  const restante = totalIngresos - totalGastos;

  // Guarda totales
  await db.collection("meses").doc(mesId).collection("totales").doc("resumen").set({
    totalGastos,
    totalIngresos,
    restante,
  });

  res.send({ totalGastos, totalIngresos, restante });
});

export default router;
