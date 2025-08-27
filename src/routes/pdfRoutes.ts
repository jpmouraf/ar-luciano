import { Router, Request, Response } from "express";
import { generatePdfBuffer } from "../services/generatePdf";
import { prismaClient } from "../config/prismaClient";

const pdfRoutes = Router();

pdfRoutes.get(
  "/pdf",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.query.id as string | undefined;

      const data = id
        ? await prismaClient.inteligenciaWasi.findUnique({ where: { id: Number(id) } })
        : await prismaClient.inteligenciaWasi.findFirst();

      if (!data) {
        res.status(404).json({ message: "Paciente não encontrado" });
        return;
      }

      const pdfBuffer = await generatePdfBuffer(data);

      const pacienteNome = data.pacienteNome ?? "paciente";
      const dataHoje = new Date().toISOString().split("T")[0];

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename=laudo-wasi-${pacienteNome}-${dataHoje}.pdf`
      );
      res.send(pdfBuffer);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao gerar PDF" });
      return;
    }
  }
);

export { pdfRoutes };
