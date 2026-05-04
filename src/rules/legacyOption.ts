import type { CompilerOptions } from "typescript";

import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.legacy.option";

const legacyOptions: (keyof CompilerOptions)[] = [
    "charset",
    "out",
    "importsNotUsedAsValues",
    "keyofStringsOnly",
    "noStrictGenericChecks",
    "noImplicitUseStrict",
    "preserveValueImports",
    "suppressExcessPropertyErrors",
    "suppressImplicitAnyIndexErrors",
    "skipDefaultLibCheck",
];


export const legacyOptionRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions;
        return legacyOptions
            .filter(opt => opt in compilerOptions)
            .map(opt => ({
                ruleId: ruleId,
                severity: "warn",
                message: `${opt} is a legacy TypeScript option and should be removed${getAdditionalInfo(opt)}`,
                category: "legacy"
            }));
    }
};

function getAdditionalInfo(opt: keyof CompilerOptions): string {
    switch (opt) {
        case "out": return " (use 'outFile' instead)";
        case "suppressExcessPropertyErrors":
        case "suppressImplicitAnyIndexErrors":
            return " (consider using @ts-ignore comment instead)";
        case "importsNotUsedAsValues":
            return " (Deprecated in favor of verbatimModuleSyntax)";
        case "skipDefaultLibCheck":
            return " (use 'skipLibCheck' instead)";
        default:
            return "";
    }
}

