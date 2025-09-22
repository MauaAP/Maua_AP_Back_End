import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const credentials: AwsCredentialIdentity = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

const region = process.env.REGION || "sa-east-1";

const s3 = new S3Client({
  credentials: credentials,
  region: region,
});

console.log("S3 Client: ", s3);

async function s3ObjectExists(key: string): Promise<boolean> {
  try {
    await s3.send(new HeadObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    }));
    return true;
  } catch (err: any) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw err;
  }
}

export async function saveCertificate(
  userId: string,
  eventId: string,
  certificatePdf: Buffer
): Promise<string> {
  console.log("S3 Client AQQQQQQQ: ", s3);
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

export async function saveCertificateIfNotExists(
  userId: string,
  eventId: string,
  certificatePdf: Buffer
): Promise<string> {
  const key = `${userId}-${eventId}-certificado.pdf`;
  const exists = await s3ObjectExists(key);
  const certificateUrl = getCertificateS3Url(userId, eventId);
  if (exists) return certificateUrl;
  await saveCertificate(userId, eventId, certificatePdf);
  return certificateUrl;
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

export async function saveCertificateExternalIfNotExists(
  email: string,
  eventId: string,
  certificatePdf: Buffer
): Promise<string> {
  const key = `certificados-externos/${email}-${eventId}-certificado.pdf`;
  const exists = await s3ObjectExists(key);
  const certificateUrl = getCertificateExternalS3Url(email, eventId);
  if (exists) return certificateUrl;
  await saveCertificateExternal(email, eventId, certificatePdf);
  return certificateUrl;
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

export async function saveReportIfNotExists(
  userId: string,
  ReportPdf: Buffer
): Promise<string> {
  const key = `relatorios/${userId}-relatorio.pdf`;
  const exists = await s3ObjectExists(key);
  const certificateUrl = getReportS3Url(userId);
  if (exists) return certificateUrl;
  await saveReport(userId, ReportPdf);
  return certificateUrl;
}

export async function saveReitoriaReport(
  date: string,
  ReportPdf: Buffer
): Promise<string> {
  console.log("Certificate report PDF type:", typeof ReportPdf);
  console.log("Certificate report PDF length:", ReportPdf.length);

  const params = {
    Bucket: `${process.env.BUCKET_NAME}`,
    Key: `relatorios-reitoria/${date}-relatorio-reitoria.pdf`,
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

export async function saveReitoriaReportIfNotExists(
  date: string,
  ReportPdf: Buffer
): Promise<string> {
  const key = `relatorios-reitoria/${date}-relatorio-reitoria.pdf`;
  const exists = await s3ObjectExists(key);
  const certificateUrl = getReitoriaReportS3Url(date);
  if (exists) return certificateUrl;
  await saveReitoriaReport(date, ReportPdf);
  return certificateUrl;
}

export function getCertificateS3Url(userId: string, eventId: string): string {
  return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${userId}-${eventId}-certificado.pdf`;
}

export function getCertificateExternalS3Url(email: string, eventId: string): string {
  return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/certificados-externos/${email}-${eventId}-certificado.pdf`;
}

export function getReportS3Url(userId: string): string {
  return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/relatorios/${userId}-relatorio.pdf`;
}

export function getReitoriaReportS3Url(date: string): string {
  return `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/relatorios-reitoria/${date}-relatorio-reitoria.pdf`;
}