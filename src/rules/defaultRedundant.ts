import type { CompilerOptions } from "typescript";
import type { Rule, Finding } from "../types.js";

const ruleId = "ts.default.redundant";

/**
 * Curated subset of "stable" TypeScript defaults.
 */
const DEFAULTS: Record<keyof CompilerOptions, boolean | string> = {
    newLine: "lf",
    chartset: "utf8",
    importsNotUsedAsValues: "remove",
    moduleDetection: "auto",
    reactNamespace: "React",
    removeComments: false,
    sourceMap: false,
    noEmit: false,
    // Completeness
    skipLibCheck: false,
    skipDefaultLibCheck: false,
    // Output Formatting
    noErrorTruncation: false,
    preserveConstEnums: false,
    pretty: true,
    // Modules
    allowArbitraryExtensions: false,
    allowImportingTsExtensions: false,
    allowUmdGlobalAccess: false,
    noResolve: false,
    noUncheckedSideEffectImports: false,
    resolveJsonModule: false,
    rewriteRelativeImportExtensions: false,
    // Interop Constraints
    esModuleInterop: false,
    forceConsistentCasingInFileNames: true,
    isolatedDeclarations: false,
    isolatedModules: false,
    preserveSymlinks: false,
    verbatimModuleSyntax: false,
    // Type Checking
    noFallthroughCasesInSwitch: false,
    noImplicitOverride: false,
    noImplicitReturns: false,
    // Language and Environment
    emitDecoratorMetadata: false,
    experimentalDecorators: false,
    noLib: false,
    target: "es5",
};

/*
// defaults to consider?
{
    allowJs: false,
    declaration: false,
    incremental: false,
    isolatedModules: false,
    "esModuleInterop": false,
    "skipLibCheck": false,
}
*/

function isEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export const defaultRedundantRule: Rule = {
    id: ruleId,

    analyze(config): Finding[] {
        const findings: Finding[] = [];

        for (const [option, defaultValue] of Object.entries(DEFAULTS)) {
            if (option in config && isEqual(config[option], defaultValue)) {
                findings.push({
                    ruleId: ruleId,
                    severity: "info",
                    message: `${option} is explicitly set to its default value (${JSON.stringify(defaultValue)}). It could be potentially removed.`,
                    category: "redundant"
                });
            }
        }

        return findings;
    }
};
