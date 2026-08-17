import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.sourcemap.conflict";

export const sourcemapConflictRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const sourceMap = options.sourceMap;
        const inlineSourceMap = options.inlineSourceMap;
        const inlineSources = options.inlineSources;
        const declaration = options.declaration;
        const declarationMap = options.declarationMap;

        const findings: Finding[] = [];

        // inlineSourceMap and sourceMap are mutually exclusive in effect
        if (inlineSourceMap && sourceMap) {
            findings.push({
                ruleId: ruleId,
                severity: "error",
                message: `Both "inlineSourceMap" and "sourceMap" are enabled. These options are mutually exclusive: inlineSourceMap embeds the map into the generated .js file, while sourceMap emits a separate .map file. Disable one of them.`,
                category: "conflict"
            });
        }

        // inlineSources only makes sense when a source map is generated
        if (inlineSources && !inlineSourceMap && !sourceMap) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"inlineSources" is enabled but neither "sourceMap" nor "inlineSourceMap" are enabled. "inlineSources" only has an effect when source maps are generated. Consider enabling a source map option or disabling inlineSources.`,
                category: "explanation"
            });
        }

        // declarationMap requires declaration to be enabled
        if (declarationMap && !declaration) {
            findings.push({
                ruleId: ruleId,
                severity: "error",
                message: `"declarationMap" is enabled but "declaration" is false or unset. declarationMap requires "declaration": true so that .d.ts files are emitted. Enable "declaration" or disable "declarationMap".`,
                category: "conflict"
            });
        }

        // If declarationMap is enabled alongside inlineSourceMap, warn: declaration maps are separate files
        if (declarationMap && inlineSourceMap) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `"declarationMap" is enabled together with "inlineSourceMap". declarationMap emits separate .d.ts.map files while inlineSourceMap embeds JS source maps. This combination may be unexpected—verify whether you intended both.`,
                category: "conflict"
            });
        }

        return findings;
    }
};
