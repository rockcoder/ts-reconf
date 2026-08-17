import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.resolveJsonModule.check";

/**
 * Checks for resolveJsonModule configuration:
 * - Suggests enabling it when using ESM/Node module resolution with modern TypeScript
 * - Warns if enabled without proper module resolution setup (outdated moduleResolution)
 * - Explains the purpose and implications of this option
 */
export const resolveJsonModuleCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const resolveJsonModule = options.resolveJsonModule;
        const moduleResolution = options.moduleResolution;
        const esModuleInterop = options.esModuleInterop;
        const allowJs = options.allowJs;

        const findings: Finding[] = [];

        // Suggest enabling resolveJsonModule with modern module resolution
        if (!resolveJsonModule && moduleResolution && moduleResolution !== "classic") {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `Consider enabling "resolveJsonModule": true. Modern projects using ${moduleResolution} module resolution typically benefit from being able to import JSON files directly (e.g., package.json, config files). This improves type safety and reduces dynamic require() calls.`,
                category: "suggestion"
            });
        }

        // Warn if resolveJsonModule is enabled with classic/outdated resolution
        if (resolveJsonModule && moduleResolution === "classic") {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `"resolveJsonModule" is enabled but "moduleResolution" is set to "classic", which is outdated. Modern module resolution (like "node", "bundler", or "nodenext") is recommended for JSON imports to work reliably.`,
                category: "conflict"
            });
        }

        // Inform about resolveJsonModule when it's enabled
        if (resolveJsonModule) {
            const details = [];
            
            if (!allowJs) {
                details.push("JSON imports work with TypeScript files");
            } else {
                details.push("JSON imports work with both TypeScript and JavaScript files");
            }
            
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"resolveJsonModule" is enabled. This allows importing JSON files as ES modules (e.g., \`import config from './config.json';\`). ${details.join(" and ")} Ensure your bundler supports this if necessary.`,
                category: "explanation"
            });
        }

        return findings;
    }
};
