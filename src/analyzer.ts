import type { CompilerOptions } from "typescript";

import type { Rule, Finding } from "./types.js";

const rules: Rule[] = [];

export function analyze(config: CompilerOptions): Finding[] {
    return rules.flatMap(rule => rule.analyze(config));
}
