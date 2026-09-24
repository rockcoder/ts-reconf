import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { extendsCheckRule } from "../../rules/extendsCheck.js";

describe("extendsCheck", () => {
    it("reports a missing extended config", () => {
        const dir = mkdtempSync(join(tmpdir(), "ts-reconf-"));
        const configPath = join(dir, "tsconfig.json");
        writeFileSync(configPath, JSON.stringify({ extends: "./missing" }));
        const findings = extendsCheckRule.analyze({
            compilerOptions: {},
            rawConfig: { extends: "./missing" },
            configPath,
        });
        expect(findings[0]?.message).toContain("does not exist");
        rmSync(dir, { recursive: true, force: true });
    });
});
