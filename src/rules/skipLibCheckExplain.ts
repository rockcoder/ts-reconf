import { Rule, Finding } from "../types.js";

const ruleId = "ts.skipLibCheck.explain";

export const skipLibCheckRule: Rule = {
    id: ruleId,

    analyze(config): Finding[] {
        if (!("skipLibCheck" in config)) return [];

        return [
            {
                ruleId: ruleId,
                severity: "info",
                message:
                    "skipLibCheck skips type checking of declaration files (*.d.ts). This improves build speed but may hide type issues in dependencies.",
                category: "explanation"
            }
        ];
    }
};
