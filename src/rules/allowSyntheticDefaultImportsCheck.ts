import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.allowSyntheticDefaultImports.check";

export const allowSyntheticDefaultImportsRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (compilerOptions.allowSyntheticDefaultImports && compilerOptions.esModuleInterop !== false) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"allowSyntheticDefaultImports" is redundant when "esModuleInterop" is enabled. Both options default to true in TypeScript 6.0.`,
                category: "redundant"
            });
        }

        return findings;
    }
};
