import { describe, expect, it } from "vitest";
import { performanceOptionsRule } from "../../rules/performanceOptions.js";

describe("performanceOptions", () => {
    it("reports broad input scope and ineffective watch output", () => {
        const findings = performanceOptionsRule.analyze({
            compilerOptions: { preserveWatchOutput: true },
            rawConfig: {},
        });
        expect(findings).toHaveLength(2);
    });
});
