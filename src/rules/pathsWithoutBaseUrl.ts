import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.paths-baseurl.conflict";

/**
 * Checks for incomplete path configuration:
 * - Warns if paths is set but baseUrl is not (paths require baseUrl to work)
 * - Suggests setting baseUrl when paths is detected
 * - Detects if baseUrl is set but paths is not (potentially unused baseUrl)
 */
export const pathsWithoutBaseUrlRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const paths = options.paths;
        const baseUrl = options.baseUrl;

        const findings: Finding[] = [];

        // Check if paths is set without baseUrl
        if (paths && Object.keys(paths).length > 0 && !baseUrl) {
            findings.push({
                ruleId: ruleId,
                severity: "error",
                message: `paths is configured but baseUrl is not set. The paths option requires baseUrl to be set to work correctly. Add "baseUrl": "." to your compilerOptions.`,
                category: "conflict"
            });
            return findings;
        }

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
