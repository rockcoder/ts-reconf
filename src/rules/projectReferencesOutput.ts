import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.projectReferences.output";

export const projectReferencesOutputRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const references = config.rawConfig.references;
        if (!references || references.length === 0) return [];
        const findings: Finding[] = [];
        if (config.compilerOptions.noEmit) {
            findings.push({
                ruleId,
                severity: "error",
                category: "conflict",
                message: `This config declares project references but "noEmit": true prevents the referenced build outputs from being produced.`,
            });
        }
        if (!config.compilerOptions.composite) {
            findings.push({
                ruleId,
                severity: "warn",
                category: "suggestion",
                message: `This config declares project references but is not composite. Enable "composite": true for a buildable referenced project.`,
            });
        }
        return findings;
    },
};
