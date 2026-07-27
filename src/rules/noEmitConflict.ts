import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.noemit.conflict";

/**
 * Checks for contradictory noEmit settings:
 * - Warns if noEmit is true but outDir is set (contradictory: can't emit AND not emit)
 * - Warns if noEmit is true but declaration is true (pointless: can't generate .d.ts)
 * - Warns if noEmit is true but declarationDir is set
 * - Detects if outFile is set with noEmit (contradictory)
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

        // Check for noEmit with outDir
        if (options.outDir) {
            findings.push({
                ruleId: ruleId,
                severity: "error",
                message: `noEmit is true but outDir is set to "${options.outDir}". These are contradictory: noEmit means "don't emit files", but outDir specifies where to emit them. Remove one of these options.`,
                category: "conflict"
            });
        }

        // Check for noEmit with outFile
        if (options.outFile) {
            findings.push({
                ruleId: ruleId,
                severity: "error",
                message: `noEmit is true but outFile is set to "${options.outFile}". These are contradictory: noEmit means "don't emit files", but outFile specifies where to emit bundled output. Remove one of these options.`,
                category: "conflict"
            });
        }

        // Check for noEmit with declaration
        if (options.declaration) {
            findings.push({
                ruleId: ruleId,
                severity: "error",
                message: `noEmit is true but declaration is true. These are contradictory: noEmit means "don't emit files", but declaration means "emit .d.ts files". Remove one of these options. If you need type checking only, use noEmit. If you need declarations, set noEmit to false.`,
                category: "conflict"
            });
        }

        // Check for noEmit with declarationDir
        if (options.declarationDir) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `noEmit is true but declarationDir is set to "${options.declarationDir}". These are contradictory: noEmit means "don't emit files", but declarationDir specifies where to emit .d.ts files. Remove one of these options.`,
                category: "conflict"
            });
        }

        return findings;
    }
};
