
import { getObject } from "./utils/s3Operations";
import { extractCommonName, generatePrivateKey, parseCertificateFromPem, parsePubKeyToPem, signPublicKey } from "./utils/forgeUtils";
import { writeToDynamoDB } from "./utils/dynamoOperations";

export const handler = async () => {
  try {
    const bucket = process.env.S3_BUCKET || "dormakaba-doychin-task";
    const key = process.env.S3_KEY || "cert-rsa.pem";
    const dynamoTable = process.env.DYNAMO_TABLE || "CertificateSignatures";

    const pemCert = await getObject(bucket, key);

    if (!pemCert) throw new Error("Certificate not found in S3");

    const cert = parseCertificateFromPem(pemCert);

    const commonName = extractCommonName(cert);

    const publicKeyPem = parsePubKeyToPem(cert.publicKey);

    const keys = generatePrivateKey("RSA");

    const baase64Signature = signPublicKey(publicKeyPem, keys, "RSA");

    await writeToDynamoDB(dynamoTable, commonName, baase64Signature)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificate processed and signed successfully",
        commonName,
      }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: (err as Error).message };
  }
};
