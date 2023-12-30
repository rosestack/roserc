import {describe, it, expect} from "vitest";

import {loadDotenv} from "~/dotenv";

import path from "path";

const fixtures = path.join(process.cwd(), "test", "fixtures");

describe("loadDotenv", () => {
  it("should load .env file", async () => {
    const file = path.join(fixtures, ".env");

    const dotenv = await loadDotenv(file);

    expect(dotenv).toEqual({
      HELLO: "world",
    });
  });
});
