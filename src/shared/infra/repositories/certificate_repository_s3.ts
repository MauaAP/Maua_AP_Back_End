import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const credentials: AwsCredentialIdentity = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

const region = process.env.REGION || "us-east-1";

const s3 = new S3Client({
  credentials: credentials,
  region: region,
});

export async function saveCertificate(
  userId: string,
  eventId: string,
  certificatePdf: Buffer
): Promise<string> {
  console.log("Certificate PDF type:", typeof certificatePdf);
  console.log("Certificate PDF length:", certificatePdf.length);

  const params = {
    Bucket: `${process.env.BUCKET_NAME}`,
    Key: `${userId}-${eventId}-certificado.pdf`,
    Body: certificatePdf,
  };
  console.log(params.Key);
  try {
    console.log("Uploading certificate to S3...");
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("Certificate uploaded successfully. Data:", data);
    const certificateUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${userId}-${eventId}-certificado.pdf`;
    return certificateUrl;
  } catch (error: any) {
    console.error("Error uploading certificate to S3:", error);
    throw new Error(`Erro ao salvar certificado no S3: ${error.message}`);
  }
}

export async function saveCertificateExternal(
  email: string,
  eventId: string,
  certificatePdf: Buffer
): Promise<string> {
  console.log("Certificate PDF type:", typeof certificatePdf);
  console.log("Certificate PDF length:", certificatePdf.length);

  const params = {
    Bucket: `${process.env.BUCKET_NAME}`,
    Key: `certificados-externos/${email}-${eventId}-certificado.pdf`,
    Body: certificatePdf,
  };
  console.log(params.Key);
  try {
    console.log("Uploading certificate to S3...");
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("Certificate uploaded successfully. Data:", data);
    const certificateUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${email}-${eventId}-certificado.pdf`;
    return certificateUrl;
  } catch (error: any) {
    console.error("Error uploading certificate to S3:", error);
    throw new Error(`Erro ao salvar certificado no S3: ${error.message}`);
  }
}

export async function saveReport(
  userId: string,
  ReportPdf: Buffer
): Promise<string> {
  console.log("Certificate PDF type:", typeof ReportPdf);
  console.log("Certificate PDF length:", ReportPdf.length);

  const params = {
    Bucket: `${process.env.BUCKET_NAME}`,
    Key: `relatorios/${userId}-relatorio.pdf`,
    Body: ReportPdf,
  };
  console.log(params.Key);
  try {
    console.log("Uploading certificate to S3...");
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("Report uploaded successfully. Data:", data);
    const certificateUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${userId}-relatorio.pdf`;
    return certificateUrl;
  } catch (error: any) {
    console.error("Error uploading certificate to S3:", error);
    throw new Error(`Erro ao salvar certificado no S3: ${error.message}`);
  }
}

export async function saveReitoriaReport(
  date: string,
  ReportPdf: Buffer
): Promise<string> {
  console.log("Certificate report PDF type:", typeof ReportPdf);
  console.log("Certificate report PDF length:", ReportPdf.length);

  const params = {
    Bucket: `${process.env.BUCKET_NAME}`,
    Key: `relatorios-reitoria/${date}-relatorio.pdf`,
    Body: ReportPdf,
  };
  console.log(params.Key);
  try {
    console.log("Uploading certificate report to S3...");
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("Certificate report uploaded successfully. Data:", data);
    const certificateUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${date}-relatorio-reitoria.pdf`;
    return certificateUrl;
  } catch (error: any) {
    console.error("Error uploading certificate report to S3:", error);
    throw new Error(`Erro ao salvar report no S3: ${error.message}`);
  }
}