import {describe, it, expect} from "vitest";

import {loadPackage} from "~/package";

describe("loadPackageJson", () => {
  it("should load the package.json file", async () => {
    const packageJson = await loadPackage(process.cwd());
    expect(packageJson).toBeDefined();
  });
});
