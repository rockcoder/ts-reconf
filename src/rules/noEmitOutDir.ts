import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.noEmitOutDir.check";

export const noEmitOutDirCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};

        const noEmit = compilerOptions.noEmit;
        const outDir = compilerOptions.outDir;

        const findings: Finding[] = [];

        if (noEmit && outDir) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"noEmit" is enabled, so "outDir" (${outDir}) is unused for this invocation. This can be intentional in a shared config.`,
                category: "explanation"
            });
        }

        return findings;
    }
};
