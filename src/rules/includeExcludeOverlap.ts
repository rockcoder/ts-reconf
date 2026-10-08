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
                severity: "info" as const,
                category: "suggestion" as const,
                message: `The include pattern "${include}" appears to overlap an exclude pattern. This is a simple pattern check; review the resolved file list to confirm whether any files are excluded unintentionally.`,
            }));
    },
};
