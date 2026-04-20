import type { CompilerOptions } from "typescript";
import type { Rule, Finding } from "../types.js";

const ruleId = "ts.noEmitOutDir.check";

export const noEmitOutDirCheckRule: Rule = {
    id: ruleId,

    analyze(config: CompilerOptions): Finding[] {

        const noEmit = config.noEmit;
        const outDir = config.outDir;

        const findings: Finding[] = [];

        if (noEmit && outDir) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `The "noEmit" option is enabled, but "outDir" is also set. No files will be emitted, so outDir has no effect. Consider removing one of these options.`,
                category: "explanation"
            });
        }

        return findings;
    }
};