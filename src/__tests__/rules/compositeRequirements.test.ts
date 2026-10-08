import { describe, expect, it } from "vitest";
import { compositeRequirementsRule } from "../../rules/compositeRequirements.js";

describe("compositeRequirements", () => {
    it("accepts composite projects with implicit declarations and noEmit", () => {
        const findings = compositeRequirementsRule.analyze({
            compilerOptions: { composite: true, noEmit: true },
            rawConfig: {},
        });
        expect(findings).toHaveLength(0);
    });
});
