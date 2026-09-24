import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.include-exclude.overlap";

function isExcluded(include: string, exclude: string): boolean {
    const normalizedInclude = include.replace(/\\/g, "/").replace(/\/\*\*$/, "");
    const normalizedExclude = exclude.replace(/\\/g, "/").replace(/\/\*\*$/, "");
    return normalizedInclude === normalizedExclude ||
        normalizedInclude.startsWith(`${normalizedExclude}/`);
}

export const includeExcludeOverlapRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const includes = config.rawConfig.include ?? [];
        const excludes = config.rawConfig.exclude ?? [];
        return includes
            .filter(include => excludes.some(exclude => isExcluded(include, exclude)))
            .map(include => ({
                ruleId,
                severity: "warn" as const,
                category: "conflict" as const,
                message: `The include pattern "${include}" is covered by an exclude pattern. It may match no files.`,
            }));
    },
};
