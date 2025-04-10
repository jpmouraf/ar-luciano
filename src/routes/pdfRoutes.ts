import { Router } from "express";
import { generatePdfBuffer } from "../services/generatePdf";
import { prismaClient } from "../config/prismaClient";

const pdfRoutes = Router();

pdfRoutes.get("/pdf", async (req, res) => {
  try {
    const pdfBuffer = await generatePdfBuffer();
    
    const data = await prismaClient.inteligenciaWasi.findFirst();
    const pacienteNome = data?.pacienteNome || "paciente";
    const dataHoje = new Date().toISOString().split('T')[0];
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition", 
      `inline; filename=laudo-wasi-${pacienteNome}-${dataHoje}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao gerar PDF" });
  }
});

export { pdfRoutes };