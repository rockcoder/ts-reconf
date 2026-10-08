import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.performance.options";

export const performanceOptionsRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const findings: Finding[] = [];
        const options = config.compilerOptions;
        if (options.preserveWatchOutput && !options.watch) {
            findings.push({
                ruleId,
                severity: "info",
                category: "suggestion",
                message: `"preserveWatchOutput": true has no effect unless TypeScript is running in watch mode.`,
            });
        }
        return findings;
    },
};
