import { JsxEmit } from "typescript";
import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.jsx.legacyTransform";

export const legacyJsxTransformCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const findings: Finding[] = [];

        if (options.jsx === JsxEmit.React) {
            findings.push({
                ruleId: ruleId,
                category: "suggestion",
                severity: "info",
                message: `"jsx" is set to "react" (legacy transform), which requires \`import React from 'react'\` in every JSX file. Consider switching to "react-jsx" (available since TS 4.1 / React 17). Set "jsx": "react-jsx" for production and "react-jsxdev" for development.`
            });
        }

        return findings;
    }
};