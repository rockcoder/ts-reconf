import { describe, expect, it } from "vitest";
import { importingTsExtensionsRule } from "../../rules/importingTsExtensions.js";

describe("importingTsExtensions", () => {
    it("requires a non-emitting configuration", () => {
        const findings = importingTsExtensionsRule.analyze({
            compilerOptions: { allowImportingTsExtensions: true },
            rawConfig: {},
        });
        expect(findings[0]?.severity).toBe("error");
    });
});
