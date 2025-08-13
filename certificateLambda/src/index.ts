
import dotenv from 'dotenv';
dotenv.config();

import { getObject } from "./utils/s3Operations";
import { extractCommonName, generatePrivateKey, parseCertificateFromPem, parsePubKeyToPem, signPublicKey } from "./utils/forgeUtils";
import { writeToDynamoDB } from "./utils/dynamoOperations";
import { BUCKET_NAME, DYNAMO_TABLE, FILE_KEY, USE_MOCK } from "./config";

export const handler = async () => {
  try {
    const pemCert = await getObject(BUCKET_NAME, FILE_KEY);

    if (!pemCert) throw new Error("Certificate not found in S3");

    const cert = parseCertificateFromPem(pemCert);

    const commonName = extractCommonName(cert);

    const publicKeyPem = parsePubKeyToPem(cert.publicKey);

    const keys = generatePrivateKey("RSA");

    const baase64Signature = signPublicKey(publicKeyPem, keys, "RSA");

    await writeToDynamoDB(DYNAMO_TABLE, commonName, baase64Signature)

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

if(USE_MOCK) {
    handler()
}