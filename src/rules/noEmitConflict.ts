import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.noemit.conflict";

/**
 * Explains output options that are unused during a noEmit invocation.
 */
export const noEmitConflictRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const noEmit = options.noEmit;

        const findings: Finding[] = [];

        // If noEmit is not true, no conflict possible
        if (!noEmit) {
            return findings;
        }

        // These options are harmless in shared configurations and may be
        // consumed by another build command that overrides noEmit.
        if (options.outFile) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"noEmit" is enabled, so "outFile" (${options.outFile}) is unused for this invocation. This can be intentional in a shared config.`,
                category: "explanation"
            });
        }

        // Check for noEmit with declarationDir
        if (options.declarationDir) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"noEmit" is enabled, so "declarationDir" (${options.declarationDir}) is unused for this invocation. This can be intentional in a shared config.`,
                category: "explanation"
            });
        }

        return findings;
    }
};
