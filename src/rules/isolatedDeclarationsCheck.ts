import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.isolatedDeclarations.check";

/**
 * Explains the relationship between isolated declarations and isolated modules.
 *
 * isolatedDeclarations: Ensures each .ts file can have declarations generated independently
 * isolatedModules: Ensures each file can be safely transpiled independently
 *
 * These options serve different purposes but are complementary:
 * - isolatedDeclarations catches declarations that need explicit annotations
 * - isolatedModules prevents transpilation errors (runtime safety)
 *
 * These options are independent; some transpilers or build pipelines benefit from both.
 */
export const isolatedDeclarationsCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const isolatedDeclarations = options.isolatedDeclarations;
        const isolatedModules = options.isolatedModules || options.verbatimModuleSyntax;

        const findings: Finding[] = [];

        // Check if isolatedDeclarations is enabled without isolatedModules
        if (isolatedDeclarations && !isolatedModules) {
            findings.push({
                ruleId: ruleId,
                severity: "info",
                message: `"isolatedDeclarations" can be used without "isolatedModules". They address different needs: isolatedDeclarations checks that declarations can be generated per file, while isolatedModules checks compatibility with single-file transpilers. Enable isolatedModules if your transpiler or build pipeline needs that check.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};
