import type {PackageJson} from "type-fest";

import path from "path";
import fs from "fs";

/**
 * Package.json loader.
 * @param file name or path to the package.json file.
 **/
const loadPackage = async (file: string): Promise<PackageJson> => {
  if (!path.isAbsolute(file)) {
    file = path.join(process.cwd(), file);
  }

  if (!file.endsWith("package.json")) {
    file = path.join(file, "package.json");
  }

  if (!fs.existsSync(file)) {
    throw new Error(`File '${file}' does not exist.`);
  }

  const packageJson = await fs.promises.readFile(file, "utf-8");

  return JSON.parse(packageJson) as PackageJson;
};

export type {
  PackageJson,
};

export {
  loadPackage,
};