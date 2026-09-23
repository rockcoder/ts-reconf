import { describe, expect, it } from "vitest";
import { includeExcludeOverlapRule } from "../../rules/includeExcludeOverlap.js";

describe("includeExcludeOverlap", () => {
    it("reports include patterns covered by excludes", () => {
        const findings = includeExcludeOverlapRule.analyze({
            compilerOptions: {},
            rawConfig: { include: ["src"], exclude: ["src"] },
        });
        expect(findings).toHaveLength(1);
    });
});
