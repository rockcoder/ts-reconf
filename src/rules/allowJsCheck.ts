import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.allowJs.check";

export const allowJsCheckRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {

        const allowJs = config.compilerOptions.allowJs;

        if (!allowJs) {
            return [];
        }

        const findings: Finding[] = [];

        findings.push({
            ruleId: ruleId,
            severity: "info",
            message: `The "allowJs" option is enabled, TypeScript will include .js files in compilation. Ensure this is intentional. Disable it if you are not mixing JS and TS.`,
            category: "explanation"
        });

        return findings;
    }
};