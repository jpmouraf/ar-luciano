import { Router } from "express";
import { prismaClient } from "../config/prismaClient";

const apiRoutes = Router();

apiRoutes.get("/inteligencia-wasi", async (req, res) => {
  try {
    const resultados = await prismaClient.inteligenciaWasi.findMany();
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar dados" });
  }
});

apiRoutes.post("/add-inteligencia", async (req, res) => {
  try {
    const { pacienteNome, ...dados } = req.body;
    
    const newEntry = await prismaClient.inteligenciaWasi.create({
      data: {
        pacienteNome,
        ...dados
      },
    });
    
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao inserir dados" });
  }
});

export { apiRoutes };