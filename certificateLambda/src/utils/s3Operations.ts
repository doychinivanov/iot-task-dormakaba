import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import path from "path";
import { USE_MOCK } from "../config";

const client = new S3Client({})

export const getObject = async (bucket: string, key: string) => {
  if (USE_MOCK) {
    const filePath = path.resolve(__dirname, "../../../example/cert-rsa.pem");
    const fileContent = await readFile(filePath, "utf-8");
    return fileContent;
  }

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const { Body } = await client.send(getObjectCommand);

  return Body?.transformToString();
}
