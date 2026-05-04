import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.verbatimModuleIsolatedModules.check";

export const verbatimModuleIsolatedModulesRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (compilerOptions.verbatimModuleSyntax && compilerOptions.isolatedModules) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"verbatimModuleSyntax" already implies "isolatedModules". Setting both options is redundant. Consider removing one of these options for cleaner configuration.`,
                category: "redundant"
            });
        }

        return findings;
    }
};