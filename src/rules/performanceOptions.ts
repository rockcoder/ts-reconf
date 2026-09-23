import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.performance.options";

export const performanceOptionsRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const findings: Finding[] = [];
        const options = config.compilerOptions;
        const raw = config.rawConfig;
        if (!raw.include && !raw.files && !raw.exclude && !options.noResolve) {
            findings.push({
                ruleId,
                severity: "info",
                category: "suggestion",
                message: `No include/files scope is configured. TypeScript may scan the whole project; narrowing the input scope can improve startup and watch performance.`,
            });
        }
        if (options.incremental && options.noEmit) {
            findings.push({
                ruleId,
                severity: "info",
                category: "suggestion",
                message: `"incremental": true with "noEmit": true may add cache work without producing build outputs. Measure whether the build-info cache improves your type-checking workflow.`,
            });
        }
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
