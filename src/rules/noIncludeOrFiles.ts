import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.noIncludeOrFiles.check";

export const noIncludeOrFilesCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const rawConfig = config.rawConfig ?? {};
        const include = rawConfig.include;
        const files = rawConfig.files;
        const exclude = rawConfig.exclude;

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
