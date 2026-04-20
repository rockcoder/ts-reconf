import { Rule, Finding } from "../types.js";

export const skipLibCheckRule: Rule = {
    id: "ts.skipLibCheck.explain",

    analyze(config): Finding[] {
        if (!("skipLibCheck" in config)) return [];

        return [
            {
                ruleId: "ts.skipLibCheck.explain",
                severity: "info",
                message:
                    "skipLibCheck skips type checking of declaration files (*.d.ts). This improves build speed but may hide type issues in dependencies.",
                category: "explanation"
            }
        ];
    }
};
