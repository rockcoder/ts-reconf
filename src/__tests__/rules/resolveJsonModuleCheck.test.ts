import { describe, expect, it } from "vitest";
import { ModuleResolutionKind } from "typescript";
import { resolveJsonModuleCheckRule } from "../../rules/resolveJsonModuleCheck.js";

describe("resolveJsonModuleCheck", () => {
    it("uses the module resolution name in suggestions", () => {
        const findings = resolveJsonModuleCheckRule.analyze({
            compilerOptions: {
                moduleResolution: ModuleResolutionKind.NodeNext,
            },
            rawConfig: {},
        });

        expect(findings[0]?.message).toContain("NodeNext module resolution");
        expect(findings[0]?.message).not.toContain("199 module resolution");
    });
});
