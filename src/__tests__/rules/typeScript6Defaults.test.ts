import { describe, expect, it } from "vitest";
import { defaultRedundantRule } from "../../rules/defaultRedundant.js";
import { forceConsistentCasingInFileNamesRule } from "../../rules/forceConsistentCasing.js";
import { strictRedundantRule } from "../../rules/strictRedundant.js";

describe("TypeScript 6 defaults", () => {
    it("recognizes explicit true defaults and the empty types default", () => {
        const findings = defaultRedundantRule.analyze({
            compilerOptions: {
                strict: true,
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                forceConsistentCasingInFileNames: true,
                types: [],
            },
            rawConfig: {},
        });

        expect(findings.map(finding => finding.message)).toEqual(expect.arrayContaining([
            expect.stringContaining("strict is explicitly set to its default value"),
            expect.stringContaining("esModuleInterop is explicitly set to its default value"),
            expect.stringContaining("allowSyntheticDefaultImports is explicitly set to its default value"),
            expect.stringContaining("forceConsistentCasingInFileNames is explicitly set to its default value"),
            expect.stringContaining("types is explicitly set to its default value"),
        ]));
    });

    it("does not warn that default-enabled strict options are absent", () => {
        const findings = forceConsistentCasingInFileNamesRule.analyze({
            compilerOptions: {},
            rawConfig: {},
        });
        expect(findings).toHaveLength(0);
    });

    it("treats strict sub-options as enabled unless strict is explicitly false", () => {
        const findings = strictRedundantRule.analyze({
            compilerOptions: { noImplicitAny: true },
            rawConfig: {},
        });
        expect(findings.some(finding => finding.message.includes("noImplicitAny"))).toBe(true);
    });
});
