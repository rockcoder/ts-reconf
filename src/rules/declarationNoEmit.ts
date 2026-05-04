import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.declarationNoEmit.check";

export const declarationNoEmitCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (compilerOptions.declaration && compilerOptions.noEmit) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `The "declaration" option is enabled, but "noEmit" is also set. No declaration files will be emitted, so "declaration" has no effect. Consider removing one of these options.`,
                category: "redundant"
            });
        }

        return findings;
    }
};