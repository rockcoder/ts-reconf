import type { CompilerOptions } from "typescript";
import type { Rule, Finding } from "../types.js";

const ruleId = "ts.noIncludeOrFiles.check";

export const noIncludeOrFilesCheckRule: Rule = {
    id: ruleId,

    analyze(config: CompilerOptions): Finding[] {
        const include = config.include;
        const files = config.files;
        const exclude = config.exclude;

        const findings: Finding[] = [];

        if (!include && !files && !exclude) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `Neither "include" nor "files" nor "exclude" options are set. TypeScript will include all files by default, consider narrowing scope for faster builds.`,
                category: "explanation"
            });
        }

        return findings;
    }
};
