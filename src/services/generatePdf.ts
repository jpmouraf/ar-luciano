import { prismaClient } from '../config/prismaClient';
import PDFDocument from 'pdfkit';

export async function generatePdfBuffer(): Promise<Buffer> {
  // Buscar dados do banco de dados
  const dados = await prismaClient.inteligenciaWasi.findFirst();
  
  if (!dados) {
    throw new Error("Nenhum dado encontrado para gerar o PDF");
  }

  // Criar um buffer para armazenar o PDF
  return new Promise((resolve, reject) => {
    try {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 50 });

      // Capturar os chunks de dados à medida que são gerados
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Adicionar conteúdo ao PDF
      doc.fontSize(20).text('LAUDO PSICOLÓGICO DE AVALIAÇÃO NEUROPSICOLÓGICA', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(16).text(`Paciente: ${dados.pacienteNome}`);
      doc.moveDown();
      
      // Dados da Escala Wechsler Abreviada de Inteligência - WASI
      doc.fontSize(14).text('Resultados da Escala Wechsler Abreviada de Inteligência - WASI', { underline: true });
      doc.moveDown();

      // Configuração da tabela
      const startX = 70;
      let startY = doc.y + 10;
      const rowHeight = 25;
      const colWidths = [110, 110, 140, 60, 110];
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);
      
      // Desenhar retângulo para o cabeçalho
      doc.rect(startX, startY - 5, tableWidth, rowHeight).stroke();
      
      // Cabeçalho da tabela
      doc.font('Helvetica-Bold');
      doc.fontSize(10);
      
      doc.text('Índice', startX + 5, startY);
      doc.text('Ponto Composto', startX + colWidths[0] + 5, startY);
      doc.text('Intervalo de Confiança 95%', startX + colWidths[0] + colWidths[1] + 5, startY);
      doc.text('Percentil', startX + colWidths[0] + colWidths[1] + colWidths[2] + 5, startY);
      doc.text('Classificação', startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, startY);
      
      // Linhas verticais do cabeçalho
      doc.moveTo(startX + colWidths[0], startY - 5).lineTo(startX + colWidths[0], startY + rowHeight - 5).stroke();
      doc.moveTo(startX + colWidths[0] + colWidths[1], startY - 5).lineTo(startX + colWidths[0] + colWidths[1], startY + rowHeight - 5).stroke();
      doc.moveTo(startX + colWidths[0] + colWidths[1] + colWidths[2], startY - 5).lineTo(startX + colWidths[0] + colWidths[1] + colWidths[2], startY + rowHeight - 5).stroke();
      doc.moveTo(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY - 5).lineTo(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], startY + rowHeight - 5).stroke();
      
      // Função para desenhar linha da tabela
      function drawTableRow(index: string, pontoComposto: string, intervalo: string, percentil: string, classificacao: string, currentY: number) {
        // Desenhar retângulo para a linha
        doc.rect(startX, currentY - 5, tableWidth, rowHeight).stroke();
        
        // Dados da linha
        doc.font('Helvetica');
        doc.text(index, startX + 5, currentY);
        doc.text(pontoComposto, startX + colWidths[0] + 5, currentY);
        doc.text(intervalo, startX + colWidths[0] + colWidths[1] + 5, currentY);
        doc.text(percentil, startX + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY);
        doc.text(classificacao, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY);
        
        // Linhas verticais
        doc.moveTo(startX + colWidths[0], currentY - 5).lineTo(startX + colWidths[0], currentY + rowHeight - 5).stroke();
        doc.moveTo(startX + colWidths[0] + colWidths[1], currentY - 5).lineTo(startX + colWidths[0] + colWidths[1], currentY + rowHeight - 5).stroke();
        doc.moveTo(startX + colWidths[0] + colWidths[1] + colWidths[2], currentY - 5).lineTo(startX + colWidths[0] + colWidths[1] + colWidths[2], currentY + rowHeight - 5).stroke();
        doc.moveTo(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY - 5).lineTo(startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY + rowHeight - 5).stroke();
      }
      
      // Dados das linhas
      startY += rowHeight;
      drawTableRow(
        'QI Verbal', 
        dados.qiVerbalPontuacao.toString(), 
        `${dados.qiVerbalIntervaloMin}–${dados.qiVerbalIntervaloMax}`, 
        dados.qiVerbalPercentil.toString(), 
        dados.qiVerbalClassificacao,
        startY
      );
      
      startY += rowHeight;
      drawTableRow(
        'QI de Execução', 
        dados.qiExecPontuacao.toString(), 
        `${dados.qiExecIntervaloMin}–${dados.qiExecIntervaloMax}`, 
        dados.qiExecPercentil.toString(), 
        dados.qiExecClassificacao,
        startY
      );
      
      startY += rowHeight;
      drawTableRow(
        'QI Total', 
        dados.qiTotalPontuacao.toString(), 
        `${dados.qiTotalIntervaloMin}–${dados.qiTotalIntervaloMax}`, 
        dados.qiTotalPercentil.toString(), 
        dados.qiTotalClassificacao,
        startY
      );
      
      // Finalizar o documento
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
}