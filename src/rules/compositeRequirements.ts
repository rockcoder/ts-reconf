import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.composite.requirements";

export const compositeRequirementsRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions;
        if (!options.composite) return [];
        const findings: Finding[] = [];
        // `composite` defaults declaration generation to true. Only an explicit
        // false value is a conflict.
        if (options.declaration === false) {
            findings.push({
                ruleId,
                severity: "error",
                category: "conflict",
                message: `"composite": true requires declaration generation. Enable "declaration": true or disable "composite".`,
            });
        }
        return findings;
    },
};
