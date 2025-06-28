import { ResendConfiguration } from "@configuration/resend.configuration";
import { Resend } from "resend";
import { injectable } from "tsyringe";

interface SendInput {
  to: string;
  pdfBuffer: Uint8Array<ArrayBufferLike>;
}

@injectable()
export default class MailService {
  private resend: Resend

  constructor(private readonly resendConfiguration: ResendConfiguration) {
    this.resend = this.resendConfiguration.getClient();
  }

  sendPdfCertificate = async ({to, pdfBuffer}: SendInput): Promise<void> => {
    await this.resend.emails.send({
      from: "Certificados <onboarding@resend.dev>",
      to: [to],
      subject: "Seu certificado está pronto!",
      text: "Segue em anexo o certificado de participação.",
      attachments: [
        {
          filename: "certificado.pdf",
          content: Buffer.from(pdfBuffer),
        },
      ],
    });
  }
}