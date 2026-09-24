import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.composite.requirements";

export const compositeRequirementsRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions;
        if (!options.composite) return [];
        const findings: Finding[] = [];
        if (!options.declaration) {
            findings.push({
                ruleId,
                severity: "error",
                category: "conflict",
                message: `"composite": true requires declaration generation. Enable "declaration": true or disable "composite".`,
            });
        }
        if (options.noEmit) {
            findings.push({
                ruleId,
                severity: "error",
                category: "conflict",
                message: `"composite": true cannot be combined with "noEmit": true because project references require build outputs.`,
            });
        }
        return findings;
    },
};
