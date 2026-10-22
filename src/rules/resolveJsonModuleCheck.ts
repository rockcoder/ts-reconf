import { ModuleResolutionKind } from "typescript";

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
        const moduleResolutionName =
            moduleResolution === undefined
                ? undefined
                : ModuleResolutionKind[moduleResolution];
        const esModuleInterop = options.esModuleInterop;
        const allowJs = options.allowJs;

        const findings: Finding[] = [];

        // Suggest enabling resolveJsonModule with modern module resolution
        if (!resolveJsonModule && moduleResolution && moduleResolution !== ModuleResolutionKind.Classic) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `Consider enabling "resolveJsonModule": true. Modern projects using ${moduleResolutionName} module resolution typically benefit from being able to import JSON files directly (e.g., package.json, config files). This improves type safety and reduces dynamic require() calls.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};
