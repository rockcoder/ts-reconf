import type { CompilerOptions } from "typescript";
import type { Rule, Finding } from "../types.js";

const ruleId = "ts.module.check";

export const moduleKindCheckRule: Rule = {
    id: ruleId,
    analyze(config: CompilerOptions): Finding[] {

        const module = config.module;

        if (!module) {
            return [];
        }

        const isCommonJS = module === 1;
        const isESM = module > 4;
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