import type { CompilerOptions } from "typescript";

import { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.strict.redundant";

export const strictRedundantRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const compilerOptions = config.compilerOptions ?? {};

        if (!compilerOptions.strict) return [];

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
            .filter(opt => compilerOptions[opt])
            .map(opt => ({
                ruleId: ruleId,
                severity: "info",
                message: `${opt} is redundant because strict=true enables it`,
                category: "redundant"
            }));
    }
};
