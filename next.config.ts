import type { NextConfig } from "next";

/** Warn when an asset/entrypoint exceeds this size. */
const WARN_BUDGET_BYTES = 15 * 1024 * 1024; // 15 MB
/** Fail the build when an asset exceeds this hard ceiling. */
const ERROR_BUDGET_BYTES = 20 * 1024 * 1024; // 20 MB

type WebpackConfig = {
  performance?: Record<string, unknown>;
  plugins?: unknown[];
  module?: {
    rules?: Array<{
      oneOf?: Array<{
        use?: Array<{
          loader?: string;
          options?: {
            modules?: Record<string, unknown>;
          };
        }>;
      }>;
    }>;
  };
};

/** Next defaults CSS Modules to mode "pure"; use "local" so Tailwind @apply is allowed. */
function allowImpureCssModules(config: WebpackConfig) {
  const oneOf = config.module?.rules?.find((rule) => Array.isArray(rule?.oneOf))?.oneOf;
  const rules = oneOf?.filter((rule) => Array.isArray(rule?.use)) ?? [];

  for (const rule of rules) {
    for (const use of rule.use ?? []) {
      const loader = use?.loader;
      if (typeof loader !== "string" || !loader.includes("css-loader")) continue;
      if (
        loader.includes("postcss-loader") ||
        loader.includes("next-flight-css-loader")
      ) {
        continue;
      }
      if (!use.options?.modules || typeof use.options.modules !== "object") continue;
      use.options.modules = {
        ...use.options.modules,
        mode: "local",
      };
    }
  }
}

function formatMb(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Hard-fail assets larger than ERROR_BUDGET_BYTES (webpack only warns at WARN_BUDGET). */
function hardSizeCeilingPlugin() {
  return {
    apply(compiler: {
      hooks: {
        afterEmit: {
          tap: (
            name: string,
            fn: (compilation: {
              assets: Record<string, { size: () => number }>;
              errors: Error[];
            }) => void,
          ) => void;
        };
      };
    }) {
      compiler.hooks.afterEmit.tap("AlgoWizSizeCeiling", (compilation) => {
        for (const [name, asset] of Object.entries(compilation.assets)) {
          const size = asset.size();
          if (size <= ERROR_BUDGET_BYTES) continue;
          compilation.errors.push(
            new Error(
              `Asset "${name}" is ${formatMb(size)} (limit ${formatMb(ERROR_BUDGET_BYTES)}).`,
            ),
          );
        }
      });
    },
  };
}

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  webpack: (config) => {
    config.performance = {
      ...config.performance,
      hints: "warning",
      maxAssetSize: WARN_BUDGET_BYTES,
      maxEntrypointSize: WARN_BUDGET_BYTES,
    };
    allowImpureCssModules(config as WebpackConfig);
    config.plugins = [...(config.plugins ?? []), hardSizeCeilingPlugin()];
    return config;
  },
};

export default nextConfig;
