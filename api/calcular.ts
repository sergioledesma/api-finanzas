import { Router } from "express";
import { db } from "./_firebase";
import { mesIdByFecha } from "./middlewares/mesIdByFecha";

const router = Router();

router.post("/:date", mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;

  // Obtener conversión activa (primer objeto con select === true)
  const conversionesSnap = await db
    .collection("meses")
    .doc(mesId)
    .collection("conversiones")
    .where("select", "==", true)
    .limit(1)
    .get();

  let conversionValor = 1;
  if (!conversionesSnap.empty) {
    const conversion = conversionesSnap.docs[0].data();
    conversionValor = conversion.valor || 1;
  }

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
    .reduce((acc, i: any) => {
      if (i.medio === "usd") {
        return acc + (i.valor * conversionValor);
      }
      return acc + i.valor;
    }, 0);
  const totalIngresosDeben = ingresos
  .filter((i: any) => i.select && i.tipo === "deben")
  .reduce((acc, i: any) => acc + i.valor, 0);
  const restante = totalIngresos - totalGastos;
  const totalIngresoMenosDeben = totalIngresos - totalIngresosDeben;
  const restanteSinDeben = restante - totalIngresosDeben;
  // Guarda totales
  await db.collection("meses").doc(mesId).collection("totales").doc("resumen").set({
    totalGastos,
    totalIngresos,
    totalIngresosDeben,
    totalIngresoMenosDeben,
    restante,
    restanteSinDeben,
  });

  res.send({ totalGastos, totalIngresos, totalIngresosDeben, totalIngresoMenosDeben, restante, restanteSinDeben });
});

export default router;
