import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.allowSyntheticDefaultImports.check";

export const allowSyntheticDefaultImportsRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (compilerOptions.allowSyntheticDefaultImports && compilerOptions.esModuleInterop) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"allowSyntheticDefaultImports" is unnecessary "esModuleInterop" already enables this behavior.`,
                category: "redundant"
            });
        }

        return findings;
    }
};