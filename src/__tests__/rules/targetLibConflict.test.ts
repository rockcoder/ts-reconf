import { describe, expect, it } from "vitest";
import { ScriptTarget } from "typescript";
import { targetLibConflictRule } from "../../rules/targetLibConflict.js";
import type { AnalysisContext } from "../../types.js";

describe("targetLibConflict", () => {
    it("handles parsed lib declaration filenames", () => {
        const config: AnalysisContext = {
            compilerOptions: {
                target: ScriptTarget.ES2020,
                lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
            },
            rawConfig: {},
        };

        const findings = targetLibConflictRule.analyze(config);

        expect(findings).toHaveLength(1);
        expect(findings[0]?.message).toContain("es2022");
    });

    it("supports current TypeScript targets", () => {
        const config: AnalysisContext = {
            compilerOptions: {
                target: ScriptTarget.ES2025,
                lib: ["lib.es2025.d.ts"],
            },
            rawConfig: {},
        };

        expect(targetLibConflictRule.analyze(config)).toHaveLength(0);
    });
});
