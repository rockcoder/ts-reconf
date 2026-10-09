import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.paths-baseurl.conflict";

/**
 * Checks for the deprecated baseUrl option.
 *
 * TypeScript 6.0 deprecates baseUrl and no longer uses it as a lookup root.
 */
export const pathsWithoutBaseUrlRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const baseUrl = options.baseUrl;

        const findings: Finding[] = [];

        if (baseUrl !== undefined) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"baseUrl" is deprecated in TypeScript 6.0 and no longer acts as a lookup root. Remove it and make any "paths" targets relative to the tsconfig file, or add an explicit catch-all mapping if you relied on bare-specifier lookup.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};
