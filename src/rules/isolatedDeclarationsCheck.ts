import type { Rule, Finding, AnalysisContext } from "../types.js";

const ruleId = "ts.isolatedDeclarations.check";

/**
 * Checks for incomplete isolated declarations configuration:
 * - Warns if isolatedDeclarations is enabled without isolatedModules
 * - Explains the complementary nature of these options
 *
 * isolatedDeclarations: Ensures each .ts file can be type-checked independently
 * isolatedModules: Ensures each file can be safely transpiled independently
 *
 * These options serve different purposes but are complementary:
 * - isolatedDeclarations catches type safety issues (explicit annotations)
 * - isolatedModules prevents transpilation errors (runtime safety)
 *
 * Both should be enabled together for maximum safety.
 */
export const isolatedDeclarationsCheckRule: Rule = {
    id: ruleId,

    analyze(config: AnalysisContext): Finding[] {
        const options = config.compilerOptions ?? {};
        const isolatedDeclarations = options.isolatedDeclarations;
        const isolatedModules = options.isolatedModules;

        const findings: Finding[] = [];

        // Check if isolatedDeclarations is enabled without isolatedModules
        if (isolatedDeclarations && !isolatedModules) {
            findings.push({
                ruleId: ruleId,
                severity: "warn",
                message: `"isolatedDeclarations" is enabled but "isolatedModules" is not. These options are complementary and should be used together: "isolatedDeclarations" ensures each file's declarations are explicit (type safety), while "isolatedModules" ensures each file can be transpiled independently (transpilation safety). Consider enabling both for maximum safety.`,
                category: "suggestion"
            });
        }

        return findings;
    }
};
