import { describe, expect, it } from "vitest";
import { projectReferencesOutputRule } from "../../rules/projectReferencesOutput.js";

describe("projectReferencesOutput", () => {
    it("does not infer buildability requirements from a project's own references", () => {
        const findings = projectReferencesOutputRule.analyze({
            compilerOptions: { noEmit: true },
            rawConfig: { references: [{ path: "./packages/core" }] },
        });
        expect(findings).toHaveLength(0);
    });
});
