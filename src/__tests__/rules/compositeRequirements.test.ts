import { describe, expect, it } from "vitest";
import { compositeRequirementsRule } from "../../rules/compositeRequirements.js";

describe("compositeRequirements", () => {
    it("requires declarations and emit for composite projects", () => {
        const findings = compositeRequirementsRule.analyze({
            compilerOptions: { composite: true, noEmit: true },
            rawConfig: {},
        });
        expect(findings).toHaveLength(2);
    });
});
