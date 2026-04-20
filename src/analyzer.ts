import type { CompilerOptions } from "typescript";

import type { Rule, Finding } from "./types.js";

import { legacyOptionRule, strictRedundantRule, skipLibCheckRule, defaultRedundantRule } from "./rules/index.js";

const rules: Rule[] = [
    legacyOptionRule,
    strictRedundantRule,
    skipLibCheckRule,
    defaultRedundantRule,
];

export function analyze(config: CompilerOptions): Finding[] {
    return rules.flatMap(rule => rule.analyze(config));
}
