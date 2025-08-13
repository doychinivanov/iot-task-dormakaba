import { S3Client } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";

jest.mock("fs/promises");
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;

jest.mock("@aws-sdk/client-s3");
const mockedSend = jest.fn();
(S3Client as unknown as jest.Mock).mockImplementation(() => ({
  send: mockedSend,
}));

describe("getObject", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  it("returns the local file content when USE_MOCK=true", async () => {
    process.env.USE_MOCK = "true";
    const MOCK_CONTENT = "mock certificate content";

    jest.mock("fs/promises");
    const { readFile } = await import("fs/promises");
    (readFile as jest.MockedFunction<typeof readFile>).mockResolvedValue(MOCK_CONTENT);

    const { getObject } = await import("../src/utils/s3Operations");
    const content = await getObject("any-bucket", "any-key");

    expect(content).toBe(MOCK_CONTENT);
  });

  it("calls S3Client.send when USE_MOCK=false", async () => {
    process.env.USE_MOCK = "false";

    const mockedSend = jest.fn().mockResolvedValue({
      Body: { transformToString: jest.fn().mockResolvedValue("s3 content") },
    });
    jest.mock("@aws-sdk/client-s3");
    const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");
    (S3Client as unknown as jest.Mock).mockImplementation(() => ({
      send: mockedSend,
    }));

    const { getObject } = await import("../src/utils/s3Operations");
    const content = await getObject("bucket", "key");

    expect(mockedSend).toHaveBeenCalledWith(expect.any(GetObjectCommand));
    expect(content).toBe("s3 content");
  });
});

