import fs from "fs";
import path from "path";

import {parse} from "dotenv";

interface Dotenv {
  [value: string]: string;
}

/**
 * Dotenv loader
 * @param file name or path to the dotenv file
 **/
const loadDotenv = async <UserEnv extends Dotenv>(file: string) => {
  if (!path.isAbsolute(file)) {
    file = path.join(process.cwd(), file);
  }

  const dotenv = await fs.promises.readFile(file, "utf8");

  return parse<UserEnv>(dotenv);
};

export type {
  Dotenv,
};

export {
  loadDotenv,
};