import {describe, it, expect} from "vitest";

import {loadTsConfig} from "~/tsconfig";

describe("loadTsConfigJson", () => {
  it("should load the tsconfig.json file", async () => {
    const tsConfigJson = await loadTsConfig(process.cwd());
    expect(tsConfigJson).toBeDefined();
  });
});