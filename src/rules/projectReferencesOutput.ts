import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.projectReferences.output";

export const projectReferencesOutputRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        // A project's own `references` do not tell us whether this project is
        // itself referenced by another project. Composite/output requirements
        // apply to referenced projects, so this config alone is insufficient
        // to diagnose them reliably.
        return [];
    },
};
