import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AwsCredentialIdentity } from "@aws-sdk/types";

const credentials: AwsCredentialIdentity = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
};

const region = process.env.REGION || "us-east-1";

const s3 = new S3Client({
  credentials: credentials,
  region: region
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
    Body: certificatePdf
  };
  console.log(params.Key);
  try {
    console.log("Uploading certificate to S3...");
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("Certificate uploaded successfully. Data:", data);
    const certificateUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${userId}-${eventId}-certificado.pdf`
    return certificateUrl;
  } catch (error: any) {
    console.error("Error uploading certificate to S3:", error);
    throw new Error(`Erro ao salvar certificado no S3: ${error.message}`);
  }
}
