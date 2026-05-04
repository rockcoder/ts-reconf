import type { Rule, Finding, AnalysisContext } from "./types.js";

import {
    legacyOptionRule,
    strictRedundantRule,
    skipLibCheckRule,
    defaultRedundantRule,
    targetLibConflictRule,
    moduleKindCheckRule,
    allowJsCheckRule,
    noEmitOutDirCheckRule,
    noIncludeOrFilesCheckRule,
    moduleResolutionMismatchRule,
    declarationNoEmitCheckRule,
    verbatimModuleIsolatedModulesRule,
} from "./rules/index.js";

const rules: Rule[] = [
    legacyOptionRule,
    strictRedundantRule,
    skipLibCheckRule,
    defaultRedundantRule,
    targetLibConflictRule,
    moduleKindCheckRule,
    allowJsCheckRule,
    noEmitOutDirCheckRule,
    noIncludeOrFilesCheckRule,
    moduleResolutionMismatchRule,
    declarationNoEmitCheckRule,
    verbatimModuleIsolatedModulesRule,
];

export function analyze(config: AnalysisContext): Finding[] {
    return rules.flatMap(rule => rule.analyze(config));
}
