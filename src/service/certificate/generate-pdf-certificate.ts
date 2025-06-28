import { singleton } from "tsyringe";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";

interface GenerateInput {
  studentName: string;
  subjectName: string;
  professorName: string;
  totalHours: number;
  issuedAt: string;
}

@singleton()
export default class GeneratePdfCertificate {
  
  generate = async ({studentName, subjectName, professorName, totalHours, issuedAt}: GenerateInput): Promise<Uint8Array<ArrayBufferLike>> => {
    const templatePath = path.resolve(__dirname, "../certificate/template/certificate.template.hbs");
    const templateHtml = await fs.readFile(templatePath, "utf-8");
    const template = handlebars.compile(templateHtml);
    const html = template({
      studentName,
      subjectName,
      professorName,
      totalHours,
      issuedAt
    });
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    return pdfBuffer;
  }
}