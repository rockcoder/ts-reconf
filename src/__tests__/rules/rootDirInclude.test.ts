import { describe, expect, it } from "vitest";
import { rootDirIncludeRule } from "../../rules/rootDirInclude.js";

describe("rootDirInclude", () => {
    it("reports files outside rootDir", () => {
        const findings = rootDirIncludeRule.analyze({
            compilerOptions: { rootDir: "src" },
            rawConfig: {},
            configPath: "/repo/tsconfig.json",
            fileNames: ["/repo/src/index.ts", "/repo/tests/index.ts"],
        });
        expect(findings[0]?.message).toContain("outside rootDir");
    });
});
