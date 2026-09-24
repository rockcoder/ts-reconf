import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ModuleKind } from "typescript";
import { modulePackageTypeRule } from "../../rules/modulePackageType.js";

describe("modulePackageType", () => {
    it("reports CommonJS with a module package", () => {
        const dir = mkdtempSync(join(tmpdir(), "ts-reconf-"));
        writeFileSync(join(dir, "package.json"), JSON.stringify({ type: "module" }));
        const findings = modulePackageTypeRule.analyze({
            compilerOptions: { module: ModuleKind.CommonJS },
            rawConfig: {},
            configPath: join(dir, "tsconfig.json"),
        });
        expect(findings[0]?.message).toContain("conflicts");
        rmSync(dir, { recursive: true, force: true });
    });
});
