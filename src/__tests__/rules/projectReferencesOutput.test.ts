import { describe, expect, it } from "vitest";
import { projectReferencesOutputRule } from "../../rules/projectReferencesOutput.js";

describe("projectReferencesOutput", () => {
    it("reports non-buildable referenced projects", () => {
        const findings = projectReferencesOutputRule.analyze({
            compilerOptions: { noEmit: true },
            rawConfig: { references: [{ path: "./packages/core" }] },
        });
        expect(findings).toHaveLength(2);
    });
});
