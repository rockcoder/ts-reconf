import { ModuleKind } from "typescript";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.module.check";

export const moduleKindCheckRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {

        const compilerOptions = config.compilerOptions ?? {};
        const module = compilerOptions.module;

        if (!module) {
            return [];
        }

        const isCommonJS = module === ModuleKind.CommonJS;
        const isESM = module >= ModuleKind.ES2015;
        const findings: Finding[] = [];

        if (isCommonJS) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `The "module" option is explicitly set to "CommonJS", your "package.json" should not have "type": "module" to avoid potential conflicts.`,
                category: "explanation"
            });
        }

        return findings;
    }
};