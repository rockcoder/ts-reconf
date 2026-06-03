import { ModuleResolutionKind, ScriptTarget } from "typescript";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.moduleResolution.outdated";

export const moduleResolutionOutdatedRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};

        const moduleResolution = options.moduleResolution;

        const findings: Finding[] = [];

        if (moduleResolution === ModuleResolutionKind.Node10) {
            findings.push({
                ruleId: ruleId,
                category: "legacy",
                severity: "warn",
                message: `"moduleResolution" is set to "node" (Node10), which is the legacy CommonJS resolution algorithm. It does not support package.json "exports", self-references via "imports", or ESM resolution rules. Consider upgrading to "node16", "nodenext" (for Node.js), or "bundler" (for Vite/Webpack/esbuild).`
            });
        }

        const target = options.target
        if (target !== undefined && target < ScriptTarget.ES2017) {
            findings.push({
                ruleId: ruleId,
                category: "suggestion",
                severity: "warn",
                message: `"target" is outdated. Consider upgrading to at least "ES2017" or "ES2020". See "https://github.com/tsconfig/bases#centralized-recommendations-for-tsconfig-bases" for more details`
            });
        }

        return findings;
    }
};