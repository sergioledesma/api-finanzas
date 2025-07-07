import { Router } from "express";
import { db } from "./_firebase";
import { mesIdByFecha } from "./middlewares/mesIdByFecha";

const router = Router();

// Agregar gasto
router.post("/:date",mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const gasto = req.body;
  if (!gasto.title || gasto.valor === undefined)
    return res.status(400).send("title y valor requeridos");

  await db
    .collection("meses")
    .doc(mesId)
    .collection("gastos")
    .add(gasto);
    
  res.send("Gasto agregado");
});

// Obtener gastos
router.get("/:date",mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const snapshot = await db.collection("meses").doc(mesId).collection("gastos").get();
  // Explicitly type gasto to include possible properties
  type Gasto = { id: string; category?: string; grupo?: string; [key: string]: any };
  const gastos: Gasto[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // Extraer IDs únicos de categorías y grupos
  const categoriaIds = [...new Set(gastos.map(g => g.category).filter(Boolean))];
  const grupoIds = [...new Set(gastos.map(g => g.grupo).filter(Boolean))];
  // Obtener categorías
  let categoriasMap: Record<string, any> = {};
  if (categoriaIds.length) {
    const categoriasSnap = await db.collection("categorias").where(
      "__name__", "in", categoriaIds
    ).get();
    categoriasMap = Object.fromEntries(
      categoriasSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }])
    );

  }

  // Obtener grupos
  let gruposMap: Record<string, any> = {};
  if (grupoIds.length) {
    const gruposSnap = await db.collection("grupos").where(
      "__name__", "in", grupoIds
    ).get();
    gruposMap = Object.fromEntries(
      gruposSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() }])
    );

  }
  // Reemplazar IDs por objetos completos
  const gastosCompletos = gastos.map(gasto => ({
    ...gasto,
    category: gasto.id && gasto.category ? categoriasMap[gasto.category] || null : null,
    grupo: gasto.id && gasto.grupo ? gruposMap[gasto.grupo] || null : null,
  }));
  res.send(gastosCompletos);
});

//editar gastos
router.put("/:date/:gastoId", mesIdByFecha, async (req, res) => {
  const mesId = (req as any).mesId;
  const { gastoId } = req.params;
  const data = req.body;

  try {
    await db
      .collection("meses")
      .doc(mesId)
      .collection("gastos")
      .doc(gastoId)
      .update(data);

    res.send("gasto actualizado");
  } catch (err) {
    res.status(404).send("gasto no encontrado o error al actualizar");
  }
});

export default router;
