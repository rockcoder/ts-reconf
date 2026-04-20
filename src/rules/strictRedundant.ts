import type { CompilerOptions } from "typescript";

import { Rule, Finding } from "../types.js";

const ruleId = "ts.strict.redundant";

export const strictRedundantRule: Rule = {
    id: ruleId,

    analyze(config): Finding[] {
        if (!config.strict) return [];

        const setByStrictOptions: (keyof CompilerOptions)[] = [
            "alwaysStrict",
            "noImplicitAny",
            "noImplicitThis",
            "strictBindCallApply",
            "strictBuiltinIteratorReturn",
            "strictFunctionTypes",
            "strictNullChecks",
            "strictPropertyInitialization",
            "useUnknownInCatchVariables"
        ];

        return setByStrictOptions
            .filter(opt => config[opt])
            .map(opt => ({
                ruleId: ruleId,
                severity: "info",
                message: `${opt} is redundant because strict=true enables it`,
                category: "redundant"
            }));
    }
};
