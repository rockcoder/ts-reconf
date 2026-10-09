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
                severity: "info",
                message: `"verbatimModuleSyntax" is not enabled. It is optional, but can make ESM import and export emit more predictable by preserving syntax without type modifiers. Consider enabling it if that matches your toolchain.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};
