import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.allowJs.check";

export const allowJsCheckRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const allowJs = compilerOptions.allowJs;
        const checkJs = compilerOptions.checkJs;

        if (!allowJs && !checkJs) {
            return [];
        }

        const findings: Finding[] = [];

        if (checkJs && !allowJs) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `The "checkJs" option is enabled without "allowJs". "checkJs" has no effect unless "allowJs" is also enabled. Consider enabling "allowJs" if you want to type-check JavaScript files, or disable "checkJs" if you only want to type-check TypeScript files.`,
                category: "explanation"
            });
        }

        findings.push({
            ruleId: ruleId,
            severity: "info",
            message: `The "allowJs" option is enabled, TypeScript will include .js files in compilation. Ensure this is intentional. Disable it if you are not mixing JS and TS.`,
            category: "explanation"
        });

        return findings;
    }
};