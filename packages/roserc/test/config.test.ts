import {describe, it, expect} from "vitest";

import {loadConfig} from "~/config";

import path from "path";

const fixtures = path.join(process.cwd(), "test", "fixtures");

describe("loadConfig", () => {
  it("should load ts.config.ts file", async () => {
    const file = path.join(fixtures, "tsconfig.ts");

    const config = await loadConfig(file, {
      modform: (mod: any) => ({
        default: mod.default,
        other1: mod.other1,
        other2: mod.other2,
      }),
    });

    expect(config).toEqual({
      "default": "simple",
      "other1": "other1",
      "other2": "other2",
    });
  });

  it("should load js.config.js file", async () => {
    const file = path.join(fixtures, "jsconfig.js");

    const config = await loadConfig(file, {
      modform: (mod: any) => ({
        default: mod.default,
        other1: mod.other1,
        other2: mod.other2,
      }),
    });

    expect(config).toEqual({
      "default": "simple",
      "other1": "other1",
      "other2": "other2",
    });
  });
});
