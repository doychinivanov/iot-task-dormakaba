// tests/dynamoOperations.test.ts
import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

jest.mock("@aws-sdk/client-dynamodb");
const mockedSend = jest.fn();
(DynamoDBClient as unknown as jest.Mock).mockImplementation(() => ({
  send: mockedSend,
}));

describe("writeToDynamoDB", () => {
  const TABLE_NAME = "test-table";
  const COMMON_NAME = "common";
  const SIGNED_KEY = "signed";

  let mockedSend: jest.Mock;

  beforeEach(() => {
    jest.resetModules(); // important
    mockedSend = jest.fn();
    jest.mock("@aws-sdk/client-dynamodb", () => {
      const original = jest.requireActual("@aws-sdk/client-dynamodb");
      return {
        ...original,
        DynamoDBClient: jest.fn().mockImplementation(() => ({
          send: mockedSend,
        })),
        PutItemCommand: original.PutItemCommand,
      };
    });
  });

  it("calls DynamoDBClient.send when USE_MOCK=false", async () => {
    process.env.USE_MOCK = "false";
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const { writeToDynamoDB } = await import("../src/utils/dynamoOperations");

    mockedSend.mockResolvedValue({}); // simulate success
    await writeToDynamoDB(TABLE_NAME, COMMON_NAME, SIGNED_KEY);

    expect(mockedSend).toHaveBeenCalledWith(expect.any(Object)); // PutItemCommand
    expect(logSpy).toHaveBeenCalledWith(
      `Successfully wrote ${COMMON_NAME} to DynamoDB`
    );

    logSpy.mockRestore();
  });

  it("throws if DynamoDBClient.send fails", async () => {
    process.env.USE_MOCK = "false";
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { writeToDynamoDB } = await import("../src/utils/dynamoOperations");

    mockedSend.mockRejectedValue(new Error("DynamoDB error"));

    await expect(
      writeToDynamoDB(TABLE_NAME, COMMON_NAME, SIGNED_KEY)
    ).rejects.toThrow("DynamoDB error");

    errorSpy.mockRestore();
  });
});

