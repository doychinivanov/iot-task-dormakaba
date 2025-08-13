import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { USE_MOCK } from "../config";

const client = new DynamoDBClient({ region: "us-east-1" });

export const writeToDynamoDB = async (tableName: string, commonName: string, signedKey: string) => {

  if (USE_MOCK) {
    console.log("Mock DynamoDB put:", {
      TableName: tableName,
      Item: {
        CommonName: { S: commonName },
        SignedPublicKey: { S: signedKey },
        Timestamp: { S: new Date().toISOString() },
      },
    });
    return {};
  }

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
