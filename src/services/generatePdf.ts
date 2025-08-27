import { prismaClient } from '../config/prismaClient';
import PDFDocument from 'pdfkit';

export async function generatePdfBuffer(dados: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 50 });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Cabeçalho
      doc.fontSize(20).text('LAUDO PSICOLÓGICO DE AVALIAÇÃO NEUROPSICOLÓGICA', {
        align: 'center'
      });
      doc.moveDown();

      doc.fontSize(16).text(`Paciente: ${dados.pacienteNome}`);
      doc.moveDown();

      doc.fontSize(14).text(
        'Resultados da Escala Wechsler Abreviada de Inteligência - WASI',
        { underline: true }
      );
      doc.moveDown();

      // Dados da tabela
      const resultados = [
        {
          indice: "QI Verbal",
          ponto: dados.qiVerbalPontuacao,
          intervalo: `${dados.qiVerbalIntervaloMin}–${dados.qiVerbalIntervaloMax}`,
          percentil: dados.qiVerbalPercentil,
          classificacao: dados.qiVerbalClassificacao,
        },
        {
          indice: "QI de Execução",
          ponto: dados.qiExecPontuacao,
          intervalo: `${dados.qiExecIntervaloMin}–${dados.qiExecIntervaloMax}`,
          percentil: dados.qiExecPercentil,
          classificacao: dados.qiExecClassificacao,
        },
        {
          indice: "QI Total",
          ponto: dados.qiTotalPontuacao,
          intervalo: `${dados.qiTotalIntervaloMin}–${dados.qiTotalIntervaloMax}`,
          percentil: dados.qiTotalPercentil,
          classificacao: dados.qiTotalClassificacao,
        },
      ];

      // Coordenadas de início
      let startY = doc.y;
      const colX = [50, 200, 260, 380, 450]; // posições de cada coluna

      // Cabeçalho da tabela
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text("Índice", colX[0], startY);
      doc.text("Ponto", colX[1], startY);
      doc.text("Intervalo", colX[2], startY);
      doc.text("Percentil", colX[3], startY);
      doc.text("Classificação", colX[4], startY);

      startY += 20;
      doc.moveTo(50, startY - 5).lineTo(550, startY - 5).stroke(); // linha horizontal

      // Linhas da tabela
      doc.font('Helvetica').fontSize(12);
      resultados.forEach(r => {
        doc.text(r.indice, colX[0], startY);
        doc.text(String(r.ponto), colX[1], startY);
        doc.text(r.intervalo, colX[2], startY);
        doc.text(String(r.percentil), colX[3], startY);
        doc.text(r.classificacao, colX[4], startY);
        startY += 20;
        doc.moveTo(50, startY - 5).lineTo(550, startY - 5).stroke();
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
