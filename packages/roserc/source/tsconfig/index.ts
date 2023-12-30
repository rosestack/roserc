import type {CompilerOptions, ProjectReference, WatchOptions} from "typescript";

import path from "path";

interface TsConfig {
  fileNames: string[];
  compilerOptions: CompilerOptions;
  watchOptions?: WatchOptions;
  references?: readonly ProjectReference[];
  include?: string[];
  exclude?: string[];
  compileOnSave?: boolean;
}

/**
 * TsConfig loader
 * @param file name or path to the tsconfig file
 **/
const loadTsConfig = async (file: string): Promise<TsConfig> => {
  if (!path.isAbsolute(file)) {
    file = path.join(process.cwd(), file);
  }

  if (!file.endsWith("tsconfig.json")) {
    file = path.join(file, "tsconfig.json");
  }
  const ts = await import("typescript").then((mod) => {
    return mod.default || mod;
  }).catch((error: any) => {
    throw new Error("Failed to load typescript module, are you sure it's installed?", {
      cause: error,
    });
  });

  const {config, error} = ts.readConfigFile(file, ts.sys.readFile);

  if (error) {
    throw new Error(ts.formatDiagnostic(error, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (fileName) => fileName,
      getNewLine: () => ts.sys.newLine,
    }));
  }

  const parsedTsFile = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(file));

  return {
    fileNames: parsedTsFile.fileNames,
    compilerOptions: parsedTsFile.options,
    watchOptions: parsedTsFile.watchOptions,
    references: parsedTsFile.projectReferences,
    include: parsedTsFile.raw.include,
    exclude: parsedTsFile.raw.exclude,
    compileOnSave: parsedTsFile.compileOnSave,
  };
};

export type {
  TsConfig,
};

export {
  loadTsConfig,
};