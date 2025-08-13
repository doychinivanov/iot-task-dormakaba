export const BUCKET_NAME = process.env.S3_BUCKET || "dormakaba-doychin-task";
export const FILE_KEY = process.env.S3_KEY || "cert-rsa.pem";
export const DYNAMO_TABLE = process.env.DYNAMO_TABLE || "CertificateSignatures";

// IF TRUE WILL MOCK AWS CALLS
// IF FALSE WILL ATTEMPT TO MAKE REAL AWS CALLS
export const USE_MOCK = process.env.USE_MOCK === "true";