import { Router, Request, Response } from "express";
import { prismaClient } from "../config/prismaClient";
import { z } from "zod";

const apiRoutes = Router();

const inteligenciaSchema = z.object({
  pacienteNome: z.string().min(1, "Nome é obrigatório"),

  qiVerbalPontuacao: z.number(),
  qiVerbalIntervaloMin: z.number(),
  qiVerbalIntervaloMax: z.number(),
  qiVerbalPercentil: z.number(),
  qiVerbalClassificacao: z.string(),

  qiExecPontuacao: z.number(),
  qiExecIntervaloMin: z.number(),
  qiExecIntervaloMax: z.number(),
  qiExecPercentil: z.number(),
  qiExecClassificacao: z.string(),

  qiTotalPontuacao: z.number(),
  qiTotalIntervaloMin: z.number(),
  qiTotalIntervaloMax: z.number(),
  qiTotalPercentil: z.number(),
  qiTotalClassificacao: z.string(),
});

apiRoutes.get(
  "/inteligencia-wasi",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const resultados = await prismaClient.inteligenciaWasi.findMany();
      res.json(resultados);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao buscar dados" });
      return;
    }
  }
);

apiRoutes.post(
  "/add-inteligencia",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedData = inteligenciaSchema.parse(req.body);

      const newEntry = await prismaClient.inteligenciaWasi.create({
        data: parsedData,
      });

      res.status(201).json(newEntry);
      return;
    } catch (err: any) {
      console.error(err);
      if (err?.name === "ZodError") {
        res.status(400).json({ message: "Dados inválidos", errors: err.errors });
        return;
      }
      res.status(500).json({ message: "Erro ao inserir dados" });
      return;
    }
  }
);

export { apiRoutes };
