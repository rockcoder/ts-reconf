import { ModuleKind } from "typescript";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.verbatimModuleSyntax.check";

export const verbatimModuleSyntaxCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (compilerOptions.module && [ModuleKind.NodeNext, ModuleKind.Node16, ModuleKind.ESNext].includes(compilerOptions.module) && !compilerOptions.verbatimModuleSyntax) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `The "verbatimModuleSyntax" is not enabled, but the module kind is set to a value that requires it. Modern ESM projects benefit from preserving import/export syntax. This avoids TypeScript rewriting imports unexpectedly. Consider enabling "verbatimModuleSyntax": true.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};