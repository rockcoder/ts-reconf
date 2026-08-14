import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.incremental.noemit.conflict";

/**
 * Checks for conflicting incremental and noEmit settings:
 * - Warns if incremental is true but noEmit is also true (pointless cache)
 * The incremental build cache (.tsbuildinfo) is only useful when files are emitted.
 * With noEmit, the cache is wasted and should be disabled.
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
            severity: "warn",
            message: `incremental is enabled but noEmit is true. The incremental build cache (.tsbuildinfo) is only useful when files are emitted. With noEmit, the incremental cache provides no benefit and wastes disk space. Either disable incremental or disable noEmit if you want faster rebuilds.`,
            category: "conflict"
        }];
    }
};
