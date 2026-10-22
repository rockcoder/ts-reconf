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
                severity: "info",
                message: `"noEmit" is enabled, so declaration files are not emitted for this invocation. This can be intentional in a shared config.`,
                category: "explanation"
            });
        }

        return findings;
    }
};
