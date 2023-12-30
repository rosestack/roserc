import type {PluginImpl} from "rollup";

import {transform} from "@swc/core";

const swcPlugin: PluginImpl = () => {
  return {
    name: "swc",
    async transform(originalCode, id) {
      const {code} = await transform(originalCode, {
        filename: id,
        jsc: {
          target: "esnext",
        },
        module: {
          type: "es6",
        },
        minify: true,
        sourceMaps: false,
        configFile: false,
        swcrc: false,
      });

      return {
        code,
      };
    },
  };
};

export default swcPlugin;