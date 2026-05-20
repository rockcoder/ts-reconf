import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.emitDeclarationOnly.noDeclaration";

export const emitDeclarationOnlyRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const emitDeclarationOnly = options.emitDeclarationOnly;
        const findings: Finding[] = [];

        if (emitDeclarationOnly && !options.declaration && !options.composite) {
            findings.push({
                ruleId: ruleId,
                category: "conflict",
                severity: "warn",
                message: `"emitDeclarationOnly" is enabled but "declaration" (or "composite") is not. TypeScript requires declaration generation to be enabled for emitDeclarationOnly to work. Either enable "declaration": true or remove "emitDeclarationOnly".`
            });
        }

        return findings;
    }
};