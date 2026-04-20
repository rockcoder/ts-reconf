import { Rule, Finding } from "../types.js";

const legacyOptions = [
    "charset",
    "out",
    "noUncheckedIndexedAccess",
    "importsNotUsedAsValues",
    "keyofStringsOnly",
    "noStrictGenericChecks",
    "noImplicitUseStrict",
    "preserveSymlinks",
    "suppressExcessPropertyErrors",
    "suppressImplicitAnyIndexErrors",
    "skipDefaultLibCheck",
];

export const legacyOptionRule: Rule = {
    id: "ts.legacy.option",

    analyze(config): Finding[] {
        return legacyOptions
            .filter(opt => opt in config)
            .map(opt => ({
                ruleId: "ts.legacy.option",
                severity: "warn",
                message: `${opt} is a legacy TypeScript option and should be removed${getAdditionalInfo(opt)}`,
                category: "legacy"
            }));
    }
};

function getAdditionalInfo(opt: string): string {
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

