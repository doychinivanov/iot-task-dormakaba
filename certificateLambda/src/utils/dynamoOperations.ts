import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const writeToDynamoDB = async (tableName: string, commonName: string, signedKey: string) => {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      CommonName: { S: commonName },
      SignedPublicKey: { S: signedKey },
      Timestamp: { S: new Date().toISOString() },
    },
  });

  try {
    await client.send(command);
    console.log(`Successfully wrote ${commonName} to DynamoDB`);
  } catch (err) {
    console.error("Error writing to DynamoDB:", err);
    throw err;
  }
};
