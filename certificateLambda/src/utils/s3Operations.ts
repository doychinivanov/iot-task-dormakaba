import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({})

export const getObject = async (bucket: string, key: string) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const { Body } = await client.send(getObjectCommand);

  return Body?.transformToString();
}
