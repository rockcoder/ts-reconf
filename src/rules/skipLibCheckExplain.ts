import { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.skipLibCheck.explain";

export const skipLibCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};
        if (!("skipLibCheck" in compilerOptions)) return [];

        return [
            {
                ruleId: ruleId,
                severity: "info",
                message: "skipLibCheck skips type checking of declaration files (*.d.ts). This improves build speed but may hide type issues in dependencies. Generally safe for apps, more risky for libraries",
                category: "explanation"
            }
        ];
    }
};
