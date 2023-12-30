import {rollup, RollupBuild} from "rollup";

import jsonPlugin from "@rollup/plugin-json";

import swcPlugin from "./plugins/swc";

import {createFilter, Pattern, Filter} from "rosetil";

import path from "path";
import url from "url";
import fs from "fs";

const bundleAndImport = async (file: string, filter: Filter): Promise<any> => {
  let build: RollupBuild | undefined = undefined;
  let configFile: string | undefined = undefined;

  try {
    build = await rollup({
      input: file,
      plugins: [
        jsonPlugin(),
        swcPlugin(),
      ],
      onwarn: () => {
        return null;
      },
      external: (id: string) => {
        if (id.startsWith(".")) {
          return false;
        }

        if (path.isAbsolute(id)) {
          return false;
        }

        return filter(id);
      },
    });

    configFile = path.join(path.dirname(file), `tmp-${Date.now()}.mjs`);

    await build.write({
      freeze: false,
      sourcemap: false,
      file: configFile,
      exports: "auto",
      format: "esm",
    });

    const generatedFile = url.pathToFileURL(configFile);

    generatedFile.hash = Date.now().toString();

    return await import(generatedFile.href);
  } catch (error) {
    throw new Error(`Could not load config file "${file}".`, {
      cause: error,
    });
  } finally {
    if (build) {
      if (!build.closed) {
        await build.close();
      }
    }

    if (configFile) {
      if (fs.existsSync(configFile)) {
        fs.unlinkSync(configFile);
      }
    }
  }
};

interface ConfigLoader<Config> {
  /**
   * Apply a transformation to the loaded module.
   * @default (mod) => mod.default
   **/
  modform?: (mod: unknown) => Config;
  /**
   * Exclude external modules that match the pattern.
   **/
  external?: Pattern;
  /**
   * Include external modules that match the pattern.
   **/
  noExternal?: Pattern;
}

/**
 * Config loader.
 * @param file name or path to the config file.
 * @param options loader options.
 **/
const loadConfig = async <Config>(file: string, options?: ConfigLoader<Config>) => {
  if (!path.isAbsolute(file)) {
    file = path.join(process.cwd(), file);
  }

  const filter = createFilter({
    exclude: options?.noExternal,
    include: options?.external,
    noNullChar: true,
    normalize: true,
  });

  const mod = await bundleAndImport(file, filter);

  let config: Config;

  if (options?.modform) {
    if (typeof options.modform !== "function") {
      throw new Error("options.modform must be a function.");
    }

    config = options.modform(mod);
  } else {
    config = mod.default;
  }

  return config;
};

export type {
  ConfigLoader,
};

export {
  loadConfig,
};