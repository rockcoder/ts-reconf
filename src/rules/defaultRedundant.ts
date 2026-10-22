import type { CompilerOptions } from "typescript";
import type { Rule, Finding } from "../types.js";

const ruleId = "ts.default.redundant";

/**
 * Curated TypeScript 6 defaults whose values are not context-dependent.
 */
const DEFAULTS: Record<keyof CompilerOptions, boolean | string | readonly string[]> = {
    reactNamespace: "React",
    removeComments: false,
    sourceMap: false,
    noEmit: false,
    // Completeness
    skipLibCheck: false,
    skipDefaultLibCheck: false,
    // Output Formatting
    noErrorTruncation: false,
    pretty: true,
    // Modules
    allowArbitraryExtensions: false,
    allowUmdGlobalAccess: false,
    noResolve: false,
    noUncheckedSideEffectImports: true,
    libReplacement: false,
    resolveJsonModule: false,
    rewriteRelativeImportExtensions: false,
    // Interop Constraints
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    isolatedDeclarations: false,
    preserveSymlinks: false,
    verbatimModuleSyntax: false,
    // Type Checking
    noFallthroughCasesInSwitch: false,
    noImplicitOverride: false,
    noImplicitReturns: false,
    strict: true,
    forceConsistentCasingInFileNames: true,
    types: [],
    // Language and Environment
    emitDecoratorMetadata: false,
    experimentalDecorators: false,
    noLib: false,
};

function isEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export const defaultRedundantRule: Rule = {
    id: ruleId,

    analyze(config): Finding[] {
        const findings: Finding[] = [];
        const compilerOptions = config.compilerOptions;

        for (const [option, defaultValue] of Object.entries(DEFAULTS)) {
            if (option in compilerOptions && isEqual(compilerOptions[option], defaultValue)) {
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
