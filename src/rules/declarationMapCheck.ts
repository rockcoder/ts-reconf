import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.declarationMap.noDeclaration";

export const declarationMapCheckRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (compilerOptions.declarationMap && !compilerOptions.declaration) {
            findings.push({
                ruleId: ruleId,
                category: "redundant",
                severity: "warn",
                message: `"declarationMap" emits ".d.ts.map" files but has no effect if "declaration" is not set to "true"`
            });
        }

        return findings;
    }

}