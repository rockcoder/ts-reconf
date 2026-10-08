import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { projectReferencesOutputRule } from "../../rules/projectReferencesOutput.js";

describe("projectReferencesOutput", () => {
    it("checks the referenced project for composite and emit requirements", () => {
        const dir = mkdtempSync(join(tmpdir(), "ts-reconf-"));
        const referencedDir = join(dir, "packages", "core");
        mkdirSync(referencedDir, { recursive: true });
        writeFileSync(join(referencedDir, "tsconfig.json"), JSON.stringify({
            compilerOptions: { noEmit: true },
        }));

        const findings = projectReferencesOutputRule.analyze({
            compilerOptions: {},
            rawConfig: { references: [{ path: "./packages/core" }] },
            configPath: join(dir, "tsconfig.json"),
        });

        expect(findings).toHaveLength(2);
        expect(findings.some(finding => finding.message.includes('"composite": true'))).toBe(true);
        expect(findings.some(finding => finding.message.includes('"noEmit": true'))).toBe(true);
        rmSync(dir, { recursive: true, force: true });
    });

    it("accepts a referenced composite project that emits outputs", () => {
        const dir = mkdtempSync(join(tmpdir(), "ts-reconf-"));
        const referencedDir = join(dir, "packages", "core");
        mkdirSync(referencedDir, { recursive: true });
        writeFileSync(join(referencedDir, "tsconfig.json"), JSON.stringify({
            compilerOptions: { composite: true },
        }));

        const findings = projectReferencesOutputRule.analyze({
            compilerOptions: {},
            rawConfig: { references: [{ path: "./packages/core" }] },
            configPath: join(dir, "tsconfig.json"),
        });

        expect(findings).toHaveLength(0);
        rmSync(dir, { recursive: true, force: true });
    });
});
