import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.forceConsistentCasingInFileNames.missing";

export const forceConsistentCasingInFileNamesRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (!compilerOptions.forceConsistentCasingInFileNames && !compilerOptions.strict) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `"forceConsistentCasingInFileNames" is not enabled (and "strict" is not set). Consider enabling it to catch cross-platform casing issues early.`,
                category: "suggestion"
            });
        }

        return findings;
    }

}