import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

export async function saveCertificate(
  userId: string,
  eventId: string,
  certificatePdf: Buffer
): Promise<string> {
  console.log("Certificate PDF type:", typeof certificatePdf); // Verificar o tipo do certificatePdf
  console.log("Certificate PDF length:", certificatePdf.length); // Verificar o comprimento do certificatePdf

  const params = {
    Bucket: "ap-imt",
    Key: `${userId}-${eventId}-certificado.pdf`,
    Body: certificatePdf
  };
  console.log(params.Key);
  try {
    console.log("Uploading certificate to S3...");
    const data = await s3.putObject(params).promise();
    console.log("Certificate uploaded successfully. Data:", data);
    const certificateUrl = `https://${process.env.BUCKET_NAME}.s3.${
        process.env.REGION
      }.amazonaws.com/${userId}-${eventId}-certificado.pdf`
    return certificateUrl;
  } catch (error: any) {
    console.error("Error uploading certificate to S3:", error);
    throw new Error(`Erro ao salvar certificado no S3: ${error.message}`);
  }
}
