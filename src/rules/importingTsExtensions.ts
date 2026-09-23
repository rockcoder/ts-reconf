import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.importing-ts-extensions";

export const importingTsExtensionsRule: Rule = {
    id: ruleId,
    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions;
        if (!options.allowImportingTsExtensions || options.noEmit || options.emitDeclarationOnly) return [];
        return [{
            ruleId,
            severity: "error",
            category: "conflict",
            message: `"allowImportingTsExtensions": true requires "noEmit": true or "emitDeclarationOnly": true because emitted JavaScript cannot resolve .ts imports.`,
        }];
    },
};
