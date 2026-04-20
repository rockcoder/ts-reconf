import { Rule, Finding } from "../types.js";

export const strictRedundantRule: Rule = {
    id: "ts.strict.redundant",

    analyze(config): Finding[] {
        if (!config.strict) return [];

        const setByStrictOptions = [
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
                ruleId: "ts.strict.redundant",
                severity: "info",
                message: `${opt} is redundant because strict=true enables it`,
                category: "redundant"
            }));
    }
};
