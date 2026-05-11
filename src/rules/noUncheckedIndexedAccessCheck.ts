import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.noUncheckedIndexedAccess.check";

export const noUncheckedIndexedAccessRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (!compilerOptions.noUncheckedIndexedAccess && compilerOptions.strict) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"noUncheckedIndexedAccess" is recommended when "strict" mode is enabled.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};