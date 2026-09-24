import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.paths-baseurl.conflict";

/**
 * Checks for potentially unnecessary baseUrl configuration.
 *
 * TypeScript resolves paths relative to the config file when baseUrl is
 * omitted, so paths alone is valid in modern TypeScript.
 */
export const pathsWithoutBaseUrlRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const paths = options.paths;
        const baseUrl = options.baseUrl;

        const findings: Finding[] = [];

        // Check if baseUrl is set without paths (softer suggestion)
        if (baseUrl && (!paths || Object.keys(paths).length === 0)) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `baseUrl is set to "${baseUrl}" but no paths are configured. If you're not using path aliases, you can remove baseUrl to simplify your config.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};
