import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.incremental.noemit.conflict";

/**
 * Explains that incremental checking can also be useful with noEmit.
 */
export const incrementalWithNoEmitConflictRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const incremental = options.incremental;
        const noEmit = options.noEmit;

        if (!incremental || !noEmit) {
            return [];
        }

        return [{
            ruleId: ruleId,
            severity: "info",
            message: `"incremental" is enabled with "noEmit". TypeScript can still cache type-checking information in this mode; keep it if it improves repeated checks.`,
            category: "explanation"
        }];
    }
};
